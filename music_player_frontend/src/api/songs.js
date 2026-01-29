import { apiRequest, getStreamUrl } from "./client";

// PUBLIC_INTERFACE
export async function listSongs({ token }) {
  /** Fetches user's songs. Expects backend endpoint GET /songs. */
  return await apiRequest("/songs", { method: "GET", token });
}

// PUBLIC_INTERFACE
export async function uploadSong({ token, file, title, artist }) {
  /** Uploads an mp3 file. Expects backend endpoint POST /songs/upload multipart/form-data. */
  const form = new FormData();
  form.append("file", file);
  if (title) form.append("title", title);
  if (artist) form.append("artist", artist);

  return await apiRequest("/songs/upload", {
    method: "POST",
    token,
    body: form,
  });
}

// PUBLIC_INTERFACE
export function getSongStreamUrl({ songId }) {
  /** Returns stream URL for a given song id. */
  return getStreamUrl(songId);
}
