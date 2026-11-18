import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ChangeEvent } from "react";
import {
  AlertCircle, Camera, CheckCircle2, Download, Film, Image as ImageIcon,
  Eye, Link2, LoaderCircle, LockKeyhole, LogOut, PanelsTopLeft, RefreshCw, Send,
  ShieldCheck, Sparkles, Upload,
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
  gradient.addColorStop(0, "#041812");
  gradient.addColorStop(.56, "#0a2822");
  gradient.addColorStop(1, "#142238");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.globalAlpha = .055;
  context.strokeStyle = "#ffffff";
  context.lineWidth = 1;
  const gridSize = Math.max(46, Math.round(width * .055));
  for (let x = 0; x <= width; x += gridSize) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
  for (let y = 0; y <= height; y += gridSize) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }

  context.globalAlpha = .14;
  context.fillStyle = accent;
  context.beginPath();
  context.arc(width * .87, height * .12, width * .28, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = .24;
  context.strokeStyle = accent;
  context.lineWidth = Math.max(2, width * .002);
  [0.12, 0.19, 0.27].forEach((radius) => { context.beginPath(); context.arc(width * .86, height * .18, width * radius, 0, Math.PI * 2); context.stroke(); });
  context.globalAlpha = 1;
  const margin = width * .075;

  context.fillStyle = "rgba(2, 17, 13, .72)";
  context.beginPath();
  context.roundRect(margin, height * .065, width * .355, height * .055, height * .028);
  context.fill();
  context.strokeStyle = `${accent}66`;
  context.stroke();
  context.fillStyle = accent;
  context.font = `700 ${Math.round(width * .019)}px monospace`;
  context.fillText("LORAPOK LABS  /  LIVING UNIVERSE", margin * 1.18, height * .1);
  context.fillStyle = "#effff8";
  context.font = `700 ${Math.round(width * (height > width ? .078 : .067))}px sans-serif`;
  wrapCanvasText(context, title, margin, height * .39, width * .78, Math.round(width * .082));
  context.fillStyle = "#abc9be";
  context.font = `${Math.round(width * .03)}px sans-serif`;
  wrapCanvasText(context, subtitle, margin, height * (height > width ? .67 : .72), width * .74, Math.round(width * .043));
  context.fillStyle = accent;
  context.fillRect(margin, height - margin * 1.08, width * .19, Math.max(7, width * .008));
  context.fillStyle = "#7b9d91";
  context.font = `600 ${Math.round(width * .016)}px monospace`;
  context.fillText("LORAPOK.TECH", width * .76, height - margin * .98);
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
  const activeNetwork = placement.startsWith("instagram") ? "Instagram" : "Facebook";
  const formatLabel = placementLabels[placement].replace(/^(Facebook|Instagram) /, "");
  return <div className="meta-publisher">
    <header className="meta-publisher-hero">
      <div>
        <span className="studio-overline"><Sparkles size={12} /> Meta publishing suite</span>
        <h1>Shape the story.<br /><em>Ship it beautifully.</em></h1>
        <p>One production desk for prepared artwork, account-safe publishing and a visible delivery record.</p>
      </div>
      <div className="meta-publisher-hero__signals" aria-label="Publishing workspace status">
        <span><strong>{connection?.pages.length || 0}</strong> managed pages</span>
        <span><strong>{placements.length}</strong> ready formats</span>
        <span className={connection?.connected ? "is-live" : ""}><i /> {connection?.connected ? "Gateway live" : "Not connected"}</span>
      </div>
    </header>

    <section className="meta-connection-card">
      <div className="meta-connection-mark"><PanelsTopLeft size={25} /><Camera size={21} /></div>
      <div><span className="studio-overline">Meta Business connection</span><h2>{connection?.connected ? "Publishing connection active" : "Connect Facebook & Instagram"}</h2><p><LockKeyhole size={12} /> Tokens stay encrypted in the protected gateway and never enter this browser or Firestore.</p></div>
      {connection?.connected
        ? <button className="meta-secondary-button" onClick={removeConnection} disabled={busy !== null}><LogOut size={15} /> Disconnect</button>
        : <button className="studio-primary-button" onClick={connect} disabled={busy !== null || connection?.configured === false}>{busy === "connect" ? <LoaderCircle className="spin" size={16} /> : <ShieldCheck size={16} />} Connect Meta</button>}
    </section>

    {(error || notice) && <div className={`meta-publisher-notice ${error ? "error" : "success"}`} role="status">{error ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}<span>{error || notice}</span></div>}

    {loading ? <div className="meta-loading"><LoaderCircle className="spin" /> Loading secure publishing workspace…</div> : connection?.connected ? <>
      <div className="meta-publisher-grid">
        <section className="studio-workspace-card meta-compose-card">
          <div className="workspace-card-heading meta-compose-heading"><div><span className="studio-overline">Publication editor</span><h2>Compose</h2><p>Choose an account, format the message and review the final crop.</p></div><button className="meta-icon-button" onClick={() => void refresh()} aria-label="Refresh accounts"><RefreshCw size={15} /></button></div>
          <div className="meta-form-section">
            <div className="meta-form-section__heading"><b>01</b><span><strong>Destination</strong><small>{activeNetwork} · {formatLabel}</small></span></div>
            <label className="meta-account-field"><span>Publishing account</span><select value={pageId} onChange={(event) => selectPage(event.target.value)}>{connection.pages.map((item) => <option key={item.id} value={item.id}>{item.name}{item.instagram ? ` · @${item.instagram.username}` : ""}</option>)}</select></label>
            <div className="meta-placement-grid">{placements.map((item) => <button key={item} type="button" className={placement === item ? "active" : ""} onClick={() => selectPlacement(item)}>{item.startsWith("facebook") ? <PanelsTopLeft size={15} /> : <Camera size={15} />}<span>{placementLabels[item].replace(/^(Facebook|Instagram) /, "")}</span><small>{item.startsWith("facebook") ? "FB" : "IG"}</small></button>)}</div>
          </div>
          <div className="meta-form-section">
            <div className="meta-form-section__heading"><b>02</b><span><strong>Message</strong><small>{caption.length} / 2,200 characters</small></span></div>
            <label><span>Publication title</span><input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} /></label>
            <label><span>Caption</span><textarea value={caption} onChange={(event) => setCaption(event.target.value)} rows={4} maxLength={2200} /></label>
          {placement === "facebook_feed" && <label>Optional link<div className="meta-input-icon"><Link2 size={15} /><input type="url" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://" /></div></label>}
          </div>
          <div className="meta-form-section meta-assets-section">
            <div className="meta-form-section__heading"><b>03</b><span><strong>Artwork</strong><small>Prepared for {socialImageDimensions(placement).width} × {socialImageDimensions(placement).height}</small></span></div>
            <label className="meta-accent-field"><span>Brand accent</span><div><input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} /><code>{accent.toUpperCase()}</code><i style={{ background: accent }} /></div></label>
            <div className="meta-action-row"><button className="meta-secondary-button" onClick={() => fileRef.current?.click()} disabled={busy !== null}>{busy === "media" ? <LoaderCircle className="spin" size={16} /> : <Upload size={16} />} Replace media</button><button className="meta-secondary-button" onClick={exportArtwork}><Download size={16} /> Export proof</button></div>
          </div>
          <input ref={fileRef} className="meta-file-input" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime" onChange={chooseMedia} />
          <div className="meta-publish-dock"><div><ShieldCheck size={14} /><span><strong>Ready for review</strong><small>Publishing creates a live {formatLabel.toLowerCase()}.</small></span></div><button className="studio-primary-button meta-publish-button" onClick={publish} disabled={busy !== null || !page}>{busy === "publish" ? <><LoaderCircle className="spin" size={16} /> Publishing…</> : <><Send size={16} /> Publish</>}</button></div>
        </section>

        <section className="meta-preview-column" aria-label="Publication preview">
          <div className="meta-preview-toolbar"><div><Eye size={15} /><span><strong>Live preview</strong><small>{page?.name || "Select an account"}</small></span></div><div><i /><span>{activeNetwork}</span><b>{formatLabel}</b></div></div>
          <div className="meta-preview-stage">
            <div className={`meta-media-preview ${placement.includes("reel") || placement.includes("story") ? "vertical" : "feed"}`} style={{ "--meta-accent": accent, aspectRatio: generatedRatio } as CSSProperties}>
              {media ? media.type === "image" ? <img src={media.previewUrl} alt="Prepared publication preview" /> : <video src={media.previewUrl} controls playsInline /> : <div className="meta-generated-preview"><div className="meta-generated-orbit" aria-hidden="true"><i /><i /><i /></div><span>Lorapok Labs / Living Universe</span><h2>{title}</h2><p>{caption}</p><footer><i /><b>LORAPOK.TECH</b></footer></div>}
              <span className="meta-preview-badge">{placementLabels[placement]}</span>
            </div>
          </div>
          <div className="meta-media-report"><div>{media?.type === "video" ? <Film size={17} /> : <ImageIcon size={17} />}<span><strong>{media ? `${media.width}×${media.height}` : `${socialImageDimensions(placement).width}×${socialImageDimensions(placement).height}`}</strong>{media?.type === "video" ? `${Math.round(media.duration || 0)} sec · source-safe upload` : "Automatic crop · high-quality JPEG · safe zone applied"}</span></div><div className="meta-media-report__state"><CheckCircle2 size={14} /> Format ready</div>{media?.warning && <p><AlertCircle size={14} />{media.warning}</p>}</div>
        </section>
      </div>

      <section className="studio-workspace-card meta-history">
        <div className="workspace-card-heading"><div><span className="studio-overline">Audit trail</span><h2>Recent publications</h2></div><strong>{connection.jobs.length}</strong></div>
        {connection.jobs.length === 0 ? <div className="studio-empty">No publications from this account yet.</div> : connection.jobs.map((job) => <article key={job.id}><div className={`meta-job-state ${job.status}`}><CheckCircle2 size={15} /></div><div><strong>{job.accountName}</strong><span>{placementLabels[job.placement]} · {new Date(job.createdAt).toLocaleString()}</span></div><code>{job.postId || job.message || job.status}</code></article>)}
      </section>
    </> : <section className="meta-empty-state"><div><PanelsTopLeft size={30} /><Camera size={25} /></div><h2>Connect once, publish from one desk.</h2><p>Choose the Facebook Pages you manage and their linked Instagram professional accounts. Meta permissions and account eligibility determine which destinations are available.</p><button className="studio-primary-button" onClick={connect} disabled={busy !== null || connection?.configured === false}><ShieldCheck size={16} /> Connect Meta Business</button>{connection?.configured === false && <small>The protected gateway still needs its Meta App configuration before accounts can connect.</small>}</section>}
  </div>;
}
