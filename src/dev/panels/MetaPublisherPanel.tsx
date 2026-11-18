import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ChangeEvent } from "react";
import {
  AlertCircle, Camera, CheckCircle2, Download, Film, Image as ImageIcon,
  Link2, LoaderCircle, LogOut, PanelsTopLeft, RefreshCw, Send, ShieldCheck, Upload,
} from "lucide-react";
import {
  beginMetaConnection, disconnectMeta, loadMetaConnection, metaPublisherOrigin, prepareImageForPlacement,
  prepareVideoForPlacement, publishMetaPost, socialImageDimensions, uploadMetaMedia,
  type MetaConnectionStatus, type MetaPlacement, type PreparedMedia,
} from "../../lib/metaPublisher";

const placementLabels: Record<MetaPlacement, string> = {
  facebook_feed: "Facebook Feed",
  facebook_reel: "Facebook Reel",
  instagram_feed: "Instagram Feed",
  instagram_reel: "Instagram Reel",
  instagram_story: "Instagram Story",
};

function buildGeneratedCard(title: string, subtitle: string, accent: string, placement: MetaPlacement) {
  const { width, height } = socialImageDimensions(placement);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Artwork rendering is not available in this browser.");
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#061c17");
  gradient.addColorStop(1, "#13243b");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.globalAlpha = .18;
  context.fillStyle = accent;
  context.beginPath();
  context.arc(width * .85, height * .13, width * .22, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
  const margin = width * .075;
  context.fillStyle = accent;
  context.font = `700 ${Math.round(width * .023)}px sans-serif`;
  context.fillText("LORAPOK LABS · LIVING UNIVERSE", margin, height * .14);
  context.fillStyle = "#effff8";
  context.font = `700 ${Math.round(width * (height > width ? .078 : .067))}px sans-serif`;
  wrapCanvasText(context, title, margin, height * .35, width * .82, Math.round(width * .082));
  context.fillStyle = "#abc9be";
  context.font = `${Math.round(width * .03)}px sans-serif`;
  wrapCanvasText(context, subtitle, margin, height * (height > width ? .65 : .72), width * .8, Math.round(width * .043));
  context.fillStyle = accent;
  context.fillRect(margin, height - margin, width * .17, Math.max(7, width * .008));
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Artwork export failed.")), "image/jpeg", .93));
}

function wrapCanvasText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(/\s+/); let line = ""; let lineY = y;
  words.forEach((word) => { const test = `${line}${word} `; if (context.measureText(test).width > maxWidth && line) { context.fillText(line, x, lineY); line = `${word} `; lineY += lineHeight; } else line = test; });
  context.fillText(line, x, lineY);
}

export default function MetaPublisherPanel() {
  const [connection, setConnection] = useState<MetaConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"connect" | "media" | "publish" | "disconnect" | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pageId, setPageId] = useState("");
  const [placement, setPlacement] = useState<MetaPlacement>("facebook_feed");
  const [title, setTitle] = useState("Living Universe 5.0");
  const [caption, setCaption] = useState("One living system. Two clear universes.");
  const [link, setLink] = useState("https://lorapok.tech");
  const [accent, setAccent] = useState("#67f5bb");
  const [media, setMedia] = useState<PreparedMedia | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const result = await loadMetaConnection();
      setConnection(result);
      setPageId((current) => current || result.pages[0]?.id || "");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Meta connection status could not be loaded.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    loadMetaConnection().then((result) => {
      if (!active) return;
      setConnection(result);
      setPageId((current) => current || result.pages[0]?.id || "");
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : "Meta connection status could not be loaded.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => () => { if (media?.previewUrl) URL.revokeObjectURL(media.previewUrl); }, [media]);

  const page = connection?.pages.find((item) => item.id === pageId) || null;
  const placements = useMemo<MetaPlacement[]>(() => [
    "facebook_feed", "facebook_reel",
    ...(page?.instagram ? ["instagram_feed", "instagram_reel", "instagram_story"] as MetaPlacement[] : []),
  ], [page]);

  const connect = async () => {
    setBusy("connect"); setError(""); setNotice("");
    try {
      const { authorizationUrl } = await beginMetaConnection();
      const popup = window.open(authorizationUrl, "lorapok-meta-connect", "popup,width=620,height=760");
      if (!popup) throw new Error("Allow pop-ups for Lorapok Office to connect Meta securely.");
      await new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(() => { cleanup(); reject(new Error("Meta connection timed out. Please try again.")); }, 180_000);
        const interval = window.setInterval(() => { if (popup.closed) { cleanup(); reject(new Error("Meta connection was closed before it finished.")); } }, 800);
        const listener = (event: MessageEvent) => {
          if (event.origin !== metaPublisherOrigin()) return;
          if (event.data?.type !== "lorapok-meta-connected") return;
          cleanup(); resolve();
        };
        const cleanup = () => { window.clearTimeout(timeout); window.clearInterval(interval); window.removeEventListener("message", listener); };
        window.addEventListener("message", listener);
      });
      setNotice("Meta is connected. Available Pages and linked Instagram accounts are ready.");
      await refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Meta could not be connected."); }
    finally { setBusy(null); }
  };

  const removeConnection = async () => {
    setBusy("disconnect"); setError("");
    try { await disconnectMeta(); setMedia(null); setNotice("The Meta connection was removed from this Office account."); await refresh(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Meta could not be disconnected."); }
    finally { setBusy(null); }
  };

  const chooseMedia = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy("media"); setError(""); setNotice("");
    try {
      const prepared = file.type.startsWith("image/")
        ? await prepareImageForPlacement(file, placement, file.name)
        : file.type.startsWith("video/")
          ? await prepareVideoForPlacement(file, placement)
          : null;
      if (!prepared) throw new Error("Choose an image or video file.");
      if (placement === "instagram_feed" && prepared.type === "video") throw new Error("Choose Instagram Reel for video publishing.");
      setMedia(prepared);
      setNotice(prepared.type === "image" ? `Image optimized to ${prepared.width}×${prepared.height}.` : "Video checked for this placement.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Media preparation failed."); }
    finally { setBusy(null); if (fileRef.current) fileRef.current.value = ""; }
  };

  const makeGeneratedMedia = async () => {
    const blob = await buildGeneratedCard(title, caption, accent, placement);
    return prepareImageForPlacement(blob, placement, "lorapok-generated.jpg");
  };

  const selectPlacement = (nextPlacement: MetaPlacement) => {
    if (nextPlacement === placement) return;
    setPlacement(nextPlacement);
    if (media) {
      setMedia(null);
      setNotice("Destination changed. Choose the source again so it can be prepared for the new format.");
    }
  };

  const selectPage = (nextPageId: string) => {
    setPageId(nextPageId);
    setPlacement("facebook_feed");
    if (media) {
      setMedia(null);
      setNotice("Page changed. Choose the media again before publishing.");
    }
  };

  const exportArtwork = async () => {
    try {
      const prepared = media?.type === "image" ? media : await makeGeneratedMedia();
      const anchor = document.createElement("a");
      anchor.href = prepared.previewUrl;
      anchor.download = prepared.filename;
      anchor.click();
      if (prepared !== media) window.setTimeout(() => URL.revokeObjectURL(prepared.previewUrl), 2000);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Artwork export failed."); }
  };

  const publish = async () => {
    if (!page) return;
    setBusy("publish"); setError(""); setNotice("");
    try {
      let activeMedia = media;
      if (!activeMedia && !(placement === "facebook_feed" && (caption.trim() || link.trim()))) activeMedia = await makeGeneratedMedia();
      if (placement !== "facebook_feed" && !activeMedia) throw new Error("This placement requires media.");
      if (placement.includes("reel") && activeMedia?.type !== "video") throw new Error("Reels require a video. Choose a compatible video file.");
      if (placement === "instagram_story" && !activeMedia) throw new Error("Instagram Stories require an image or video.");
      const uploaded = activeMedia ? await uploadMetaMedia(activeMedia) : null;
      const result = await publishMetaPost({
        pageId: page.id,
        instagramAccountId: placement.startsWith("instagram") ? page.instagram?.id : undefined,
        placement,
        mediaUrl: uploaded?.mediaUrl,
        mediaType: activeMedia?.type,
        caption: caption.trim(),
        title: title.trim(),
        link: link.trim(),
      });
      setNotice(`${placementLabels[placement]} published successfully · ${result.postId}`);
      await refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "The post could not be published."); }
    finally { setBusy(null); }
  };

  const generatedRatio = placement.includes("reel") || placement.includes("story") ? "9 / 16" : "4 / 5";
  return <div className="meta-publisher">
    <section className="meta-connection-card">
      <div className="meta-connection-mark"><PanelsTopLeft size={25} /><Camera size={21} /></div>
      <div><span className="studio-overline">Meta Business connection</span><h2>{connection?.connected ? "Publishing connection active" : "Connect Facebook & Instagram"}</h2><p>Access tokens remain encrypted in the protected publishing gateway and never enter this browser or Firestore.</p></div>
      {connection?.connected
        ? <button className="meta-secondary-button" onClick={removeConnection} disabled={busy !== null}><LogOut size={15} /> Disconnect</button>
        : <button className="studio-primary-button" onClick={connect} disabled={busy !== null || connection?.configured === false}>{busy === "connect" ? <LoaderCircle className="spin" size={16} /> : <ShieldCheck size={16} />} Connect Meta</button>}
    </section>

    {(error || notice) && <div className={`meta-publisher-notice ${error ? "error" : "success"}`} role="status">{error ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}<span>{error || notice}</span></div>}

    {loading ? <div className="meta-loading"><LoaderCircle className="spin" /> Loading secure publishing workspace…</div> : connection?.connected ? <>
      <div className="meta-publisher-grid">
        <section className="studio-workspace-card meta-compose-card">
          <div className="workspace-card-heading"><div><span className="studio-overline">Destination</span><h2>Compose publication</h2></div><button className="meta-icon-button" onClick={() => void refresh()} aria-label="Refresh accounts"><RefreshCw size={15} /></button></div>
          <label>Facebook Page<select value={pageId} onChange={(event) => selectPage(event.target.value)}>{connection.pages.map((item) => <option key={item.id} value={item.id}>{item.name}{item.instagram ? ` · @${item.instagram.username}` : ""}</option>)}</select></label>
          <div className="meta-placement-grid">{placements.map((item) => <button key={item} type="button" className={placement === item ? "active" : ""} onClick={() => selectPlacement(item)}>{item.startsWith("facebook") ? <PanelsTopLeft size={15} /> : <Camera size={15} />}<span>{placementLabels[item].replace(/^(Facebook|Instagram) /, "")}</span></button>)}</div>
          <label>Publication title<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} /></label>
          <label>Caption<textarea value={caption} onChange={(event) => setCaption(event.target.value)} rows={5} maxLength={2200} /></label>
          {placement === "facebook_feed" && <label>Optional link<div className="meta-input-icon"><Link2 size={15} /><input type="url" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://" /></div></label>}
          <label>Brand accent<input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} /></label>
          <div className="meta-action-row"><button className="meta-secondary-button" onClick={() => fileRef.current?.click()} disabled={busy !== null}>{busy === "media" ? <LoaderCircle className="spin" size={16} /> : <Upload size={16} />} Choose media</button><button className="meta-secondary-button" onClick={exportArtwork}><Download size={16} /> Export image</button></div>
          <input ref={fileRef} className="meta-file-input" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime" onChange={chooseMedia} />
          <button className="studio-primary-button meta-publish-button" onClick={publish} disabled={busy !== null || !page}>{busy === "publish" ? <><LoaderCircle className="spin" size={16} /> Preparing & publishing…</> : <><Send size={16} /> Publish to {placementLabels[placement]}</>}</button>
        </section>

        <section className="meta-preview-column">
          <div className={`meta-media-preview ${placement.includes("reel") || placement.includes("story") ? "vertical" : "feed"}`} style={{ "--meta-accent": accent, aspectRatio: generatedRatio } as CSSProperties}>
            {media ? media.type === "image" ? <img src={media.previewUrl} alt="Prepared publication preview" /> : <video src={media.previewUrl} controls playsInline /> : <div className="meta-generated-preview"><span>Lorapok Labs · Living Universe</span><h2>{title}</h2><p>{caption}</p><i /></div>}
            <span className="meta-preview-badge">{placementLabels[placement]}</span>
          </div>
          <div className="meta-media-report"><div>{media?.type === "video" ? <Film size={17} /> : <ImageIcon size={17} />}<span><strong>{media ? `${media.width}×${media.height}` : `${socialImageDimensions(placement).width}×${socialImageDimensions(placement).height}`}</strong>{media?.type === "video" ? `${Math.round(media.duration || 0)} sec · source-safe upload` : "automatic crop · high-quality JPEG"}</span></div>{media?.warning && <p><AlertCircle size={14} />{media.warning}</p>}</div>
        </section>
      </div>

      <section className="studio-workspace-card meta-history">
        <div className="workspace-card-heading"><div><span className="studio-overline">Audit trail</span><h2>Recent publications</h2></div><strong>{connection.jobs.length}</strong></div>
        {connection.jobs.length === 0 ? <div className="studio-empty">No publications from this account yet.</div> : connection.jobs.map((job) => <article key={job.id}><div className={`meta-job-state ${job.status}`}><CheckCircle2 size={15} /></div><div><strong>{job.accountName}</strong><span>{placementLabels[job.placement]} · {new Date(job.createdAt).toLocaleString()}</span></div><code>{job.postId || job.message || job.status}</code></article>)}
      </section>
    </> : <section className="meta-empty-state"><div><PanelsTopLeft size={30} /><Camera size={25} /></div><h2>Connect once, publish from one desk.</h2><p>Choose the Facebook Pages you manage and their linked Instagram professional accounts. Meta permissions and account eligibility determine which destinations are available.</p><button className="studio-primary-button" onClick={connect} disabled={busy !== null || connection?.configured === false}><ShieldCheck size={16} /> Connect Meta Business</button>{connection?.configured === false && <small>The protected gateway still needs its Meta App configuration before accounts can connect.</small>}</section>}
  </div>;
}
