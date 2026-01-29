import React from "react";

function formatDuration(seconds) {
  if (typeof seconds !== "number" || Number.isNaN(seconds) || seconds < 0) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function normalizeSong(raw) {
  // Defensive mapping to support varying backend payloads.
  return {
    id: raw?.id ?? raw?.song_id ?? raw?._id ?? raw?.uuid ?? raw?.filename ?? "",
    title: raw?.title ?? raw?.name ?? raw?.filename ?? "Untitled",
    artist: raw?.artist ?? raw?.author ?? "",
    duration: raw?.duration ?? raw?.length_seconds ?? raw?.seconds ?? null,
  };
}

// PUBLIC_INTERFACE
export function SongList({ songs, loading, error, onPlay, onRefresh }) {
  /** Song library list with per-item play button. */
  if (loading) {
    return (
      <div className="card-body">
        <p className="muted">Loading your library…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-body">
        <p className="error">{error}</p>
        <button className="btn btn-small" type="button" onClick={onRefresh}>
          Retry
        </button>
      </div>
    );
  }

  const normalized = Array.isArray(songs) ? songs.map(normalizeSong) : [];

  if (!normalized.length) {
    return (
      <div className="card-body">
        <p className="muted">No songs yet. Upload an mp3 to get started.</p>
      </div>
    );
  }

  return (
    <div className="card-body">
      <div className="list" role="list">
        {normalized.map((s) => (
          <div key={s.id || `${s.title}_${s.artist}`} className="song-row" role="listitem">
            <div className="song-meta">
              <strong title={s.title}>{s.title}</strong>
              <span title={s.artist || ""}>
                {s.artist ? s.artist : "Unknown artist"}
              </span>
            </div>

            <div className="song-actions">
              {s.duration != null ? <span className="badge">{formatDuration(s.duration)}</span> : null}
              <button className="btn btn-small btn-primary" type="button" onClick={() => onPlay(s)}>
                Play
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
