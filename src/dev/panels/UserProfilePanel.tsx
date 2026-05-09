import { useState, useEffect } from "react";
import { useDevAuth } from "../DevAuth";
import { storage, db } from "../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";

interface StoredData {
  id: string;
  key: string;
  value: string;
  createdAt: any;
}

interface StoredFile {
  name: string;
  url: string;
  fullPath: string;
}

export default function UserProfilePanel() {
  const { user } = useDevAuth();
  
  // Data State
  const [dataKey, setDataKey] = useState("");
  const [dataValue, setDataValue] = useState("");
  const [userDataList, setUserDataList] = useState<StoredData[]>([]);
  const [savingData, setSavingData] = useState(false);

  // File State
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    // Listen to user's stored data
    const q = query(collection(db, `users/${user.uid}/data`), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setUserDataList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoredData)));
    });

    fetchFiles();

    return () => unsub();
  }, [user]);

  const fetchFiles = async () => {
    if (!user) return;
    const listRef = ref(storage, `users/${user.uid}/files`);
    try {
      const res = await listAll(listRef);
      const filePromises = res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { name: itemRef.name, url, fullPath: itemRef.fullPath };
      });
      const fileList = await Promise.all(filePromises);
      setFiles(fileList);
    } catch (e) {
      console.error("Failed to fetch files:", e);
    }
  };

  const handleSaveData = async () => {
    if (!user || !dataKey.trim() || !dataValue.trim()) return;
    setSavingData(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/data`), {
        key: dataKey.trim(),
        value: dataValue.trim(),
        createdAt: serverTimestamp(),
      });
      setDataKey("");
      setDataValue("");
    } catch (e) {
      alert("Error saving data");
    } finally {
      setSavingData(false);
    }
  };

  const handleDeleteData = async (id: string) => {
    if (!user) return;
    if (confirm("Delete this entry?")) {
      await deleteDoc(doc(db, `users/${user.uid}/data`, id));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const storageRef = ref(storage, `users/${user.uid}/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed", error);
        setUploading(false);
        alert("Upload failed");
      },
      () => {
        setUploading(false);
        setUploadProgress(0);
        fetchFiles();
      }
    );
  };

  const handleDeleteFile = async (fullPath: string) => {
    if (confirm("Delete this file?")) {
      const fileRef = ref(storage, fullPath);
      try {
        await deleteObject(fileRef);
        fetchFiles();
      } catch (e) {
        alert("Failed to delete file");
      }
    }
  };

  if (!user) {
    return (
      <div className="dev-panel-content">
        <div className="dev-empty-state">
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
          <p>Please log in via the Lorapok dev menu to access your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">User <span>Profile</span></div>
        <div className="dev-panel-sub">Manage your personal data, API settings, and file uploads.</div>
      </div>

      <div className="dev-g2">
        {/* Data Storage Section */}
        <div className="dev-card">
          <div className="dev-stitle"><span className="dev-stitle-dot" />Cloud Storage Data</div>
          <p className="dev-auth-sub" style={{ marginBottom: "1rem" }}>Save configurations, keys, or JSON payloads.</p>
          
          <div className="dev-form-group">
            <input className="dev-form-input" placeholder="Key (e.g. settings_theme)" value={dataKey} onChange={e => setDataKey(e.target.value)} />
          </div>
          <div className="dev-form-group">
            <textarea className="dev-form-textarea" placeholder="Value..." value={dataValue} onChange={e => setDataValue(e.target.value)} style={{ height: "80px" }} />
          </div>
          <button className="dev-btn dev-btn-primary" onClick={handleSaveData} disabled={savingData || !dataKey || !dataValue}>
            {savingData ? "Saving..." : "Save Data"}
          </button>

          <div style={{ marginTop: "2rem" }}>
            <div className="dev-stitle" style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>Stored Entries</div>
            {userDataList.length === 0 ? (
              <div className="dev-empty-state" style={{ padding: "1rem", minHeight: "auto" }}>No data found.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {userDataList.map(item => (
                  <div key={item.id} className="dev-msg" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ color: "var(--dev-fg)" }}>{item.key}:</strong> <span style={{ color: "var(--dev-muted2)" }}>{item.value.length > 50 ? item.value.substring(0, 50) + "..." : item.value}</span>
                    </div>
                    <button className="dev-btn dev-btn-ghost dev-btn-sm" style={{ color: "var(--dev-red)", padding: "0 0.5rem" }} onClick={() => handleDeleteData(item.id)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* File Upload Section */}
        <div className="dev-card">
          <div className="dev-stitle"><span className="dev-stitle-dot" />File Storage</div>
          <p className="dev-auth-sub" style={{ marginBottom: "1rem" }}>Upload images, documents, or assets to your personal Firebase bucket.</p>
          
          <div className="dev-form-group">
            <label className="dev-btn dev-btn-ghost" style={{ display: "inline-block", textAlign: "center", cursor: "pointer", width: "100%" }}>
              {uploading ? `Uploading... ${Math.round(uploadProgress)}%` : "Choose File to Upload"}
              <input type="file" style={{ display: "none" }} onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <div className="dev-stitle" style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>Your Files</div>
            {files.length === 0 ? (
              <div className="dev-empty-state" style={{ padding: "1rem", minHeight: "auto" }}>No files uploaded.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {files.map(file => (
                  <div key={file.fullPath} className="dev-msg" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <a href={file.url} target="_blank" rel="noreferrer" style={{ color: "var(--dev-cyan)", textDecoration: "none", wordBreak: "break-all" }}>
                      {file.name}
                    </a>
                    <button className="dev-btn dev-btn-ghost dev-btn-sm" style={{ color: "var(--dev-red)", padding: "0 0.5rem" }} onClick={() => handleDeleteFile(file.fullPath)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
