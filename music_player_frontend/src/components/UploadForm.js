import React, { useMemo, useState } from "react";
import { uploadSong } from "../api/songs";
import { useToast } from "../contexts/ToastContext";

function isMp3(file) {
  if (!file) return false;
  if (file.type === "audio/mpeg") return true;
  return /\.mp3$/i.test(file.name || "");
}

// PUBLIC_INTERFACE
export function UploadForm({ onUploaded }) {
  /** Upload panel for mp3 file upload (public/anonymous). */
  const { pushToast } = useToast();

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileError = useMemo(() => {
    if (!file) return "Select an mp3 file to upload.";
    if (!isMp3(file)) return "Only .mp3 files are supported.";
    return "";
  }, [file]);

  const canSubmit = !fileError && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await uploadSong({ file, title: title.trim(), artist: artist.trim() });
      pushToast({ type: "success", title: "Uploaded", message: "Your song was uploaded successfully." });
      setFile(null);
      setTitle("");
      setArtist("");
      onUploaded?.();
    } catch (err) {
      const msg = err?.message || "Upload failed.";
      setError(msg);
      pushToast({ type: "error", title: "Upload failed", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div>
        <label className="label" htmlFor="file">
          MP3 file
        </label>
        <input
          id="file"
          className="input"
          type="file"
          accept=".mp3,audio/mpeg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {fileError ? <p className="error">{fileError}</p> : <p className="form-help">Files stay in your library.</p>}
      </div>

      <div>
        <label className="label" htmlFor="title">
          Title (optional)
        </label>
        <input
          id="title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Song title"
        />
      </div>

      <div>
        <label className="label" htmlFor="artist">
          Artist (optional)
        </label>
        <input
          id="artist"
          className="input"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Artist"
        />
      </div>

      {error ? <p className="error">{error}</p> : null}

      <button className="btn btn-primary" type="submit" disabled={!canSubmit}>
        {submitting ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
