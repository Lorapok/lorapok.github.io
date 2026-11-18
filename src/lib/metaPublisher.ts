import { auth } from "./firebase";

export type MetaPlacement =
  | "facebook_feed"
  | "facebook_reel"
  | "instagram_feed"
  | "instagram_reel"
  | "instagram_story";

export interface MetaInstagramAccount {
  id: string;
  username: string;
  name: string;
  profilePictureUrl?: string;
}

export interface MetaPageAccount {
  id: string;
  name: string;
  pictureUrl?: string;
  instagram: MetaInstagramAccount | null;
}

export interface MetaPublishJob {
  id: string;
  placement: MetaPlacement;
  accountName: string;
  status: "published" | "failed";
  createdAt: string;
  postId?: string;
  message?: string;
}

export interface MetaConnectionStatus {
  configured: boolean;
  connected: boolean;
  expiresAt?: string;
  pages: MetaPageAccount[];
  jobs: MetaPublishJob[];
  message?: string;
}

export interface PreparedMedia {
  blob: Blob;
  type: "image" | "video";
  width: number;
  height: number;
  duration?: number;
  warning?: string;
  previewUrl: string;
  filename: string;
}

const endpoint = ((import.meta.env.VITE_META_PUBLISHER_URL as string | undefined)
  || "https://lorapok-social-publisher.mdshuvo40.workers.dev").replace(/\/$/, "");

export function metaPublisherOrigin() {
  return new URL(endpoint).origin;
}

async function authorizedFetch(path: string, init: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Sign in to Lorapok Office before using Social Publishing.");
  const token = await user.getIdToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${endpoint}${path}`, { ...init, headers });
  const payload = await response.json().catch(() => ({})) as { error?: string };
  if (!response.ok) throw new Error(payload.error || `Social Publisher returned ${response.status}.`);
  return payload;
}

export async function loadMetaConnection(): Promise<MetaConnectionStatus> {
  return authorizedFetch("/api/status") as Promise<MetaConnectionStatus>;
}

export async function beginMetaConnection() {
  return authorizedFetch("/api/connect/start", { method: "POST" }) as Promise<{ authorizationUrl: string }>;
}

export async function disconnectMeta() {
  await authorizedFetch("/api/connection", { method: "DELETE" });
}

export async function uploadMetaMedia(media: PreparedMedia) {
  const body = new FormData();
  body.set("file", media.blob, media.filename);
  body.set("mediaType", media.type);
  body.set("width", String(media.width));
  body.set("height", String(media.height));
  if (media.duration) body.set("duration", String(media.duration));
  return authorizedFetch("/api/media", { method: "POST", body }) as Promise<{ mediaUrl: string; mediaKey: string }>;
}

export async function publishMetaPost(input: {
  pageId: string;
  instagramAccountId?: string;
  placement: MetaPlacement;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  caption: string;
  title?: string;
  link?: string;
}) {
  return authorizedFetch("/api/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }) as Promise<{ ok: true; postId: string; placement: MetaPlacement }>;
}

const IMAGE_TARGETS: Record<MetaPlacement, { width: number; height: number }> = {
  facebook_feed: { width: 1080, height: 1350 },
  instagram_feed: { width: 1080, height: 1350 },
  facebook_reel: { width: 1080, height: 1920 },
  instagram_reel: { width: 1080, height: 1920 },
  instagram_story: { width: 1080, height: 1920 },
};

function loadImage(file: Blob) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("This image could not be decoded.")); };
    image.src = url;
  });
}

export async function prepareImageForPlacement(file: File | Blob, placement: MetaPlacement, filename = "lorapok-social.jpg"): Promise<PreparedMedia> {
  const image = await loadImage(file);
  const target = IMAGE_TARGETS[placement];
  const canvas = document.createElement("canvas");
  canvas.width = target.width;
  canvas.height = target.height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Image processing is not available in this browser.");
  const sourceRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = target.width / target.height;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;
  let sourceX = 0;
  let sourceY = 0;
  if (sourceRatio > targetRatio) {
    sourceWidth = image.naturalHeight * targetRatio;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = image.naturalWidth / targetRatio;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, target.width, target.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", .92));
  if (!blob) throw new Error("The optimized image could not be created.");
  return {
    blob,
    type: "image",
    width: target.width,
    height: target.height,
    previewUrl: URL.createObjectURL(blob),
    filename: filename.replace(/\.[^.]+$/, "") + `-${target.width}x${target.height}.jpg`,
  };
}

function readVideoMetadata(file: File) {
  return new Promise<{ width: number; height: number; duration: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const result = { width: video.videoWidth, height: video.videoHeight, duration: video.duration };
      URL.revokeObjectURL(url);
      resolve(result);
    };
    video.onerror = () => { URL.revokeObjectURL(url); reject(new Error("This video could not be decoded.")); };
    video.src = url;
  });
}

export async function prepareVideoForPlacement(file: File, placement: MetaPlacement): Promise<PreparedMedia> {
  const metadata = await readVideoMetadata(file);
  if (!Number.isFinite(metadata.duration) || metadata.duration <= 0) throw new Error("The video duration is invalid.");
  const vertical = placement.includes("reel") || placement.includes("story");
  const ratio = metadata.width / metadata.height;
  const warning = vertical && (ratio < .5 || ratio > .63)
    ? "For a full-screen result, use a 9:16 video. This source will be uploaded without destructive transcoding."
    : undefined;
  return {
    blob: file,
    type: "video",
    width: metadata.width,
    height: metadata.height,
    duration: metadata.duration,
    warning,
    previewUrl: URL.createObjectURL(file),
    filename: file.name,
  };
}

export function socialImageDimensions(placement: MetaPlacement) {
  return IMAGE_TARGETS[placement];
}
