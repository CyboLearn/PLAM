export type MediaType = "image" | "video" | "audio" | "other";

export function getMediaType(mimetype: string) {
  if (mimetype.includes("image")) {
    return "image";
  }

  if (mimetype.includes("video")) {
    return "video";
  }

  if (mimetype.includes("audio")) {
    return "audio";
  }

  return "other";
}