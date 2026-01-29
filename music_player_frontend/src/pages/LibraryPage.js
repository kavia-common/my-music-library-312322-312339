import React, { useCallback, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { UploadForm } from "../components/UploadForm";
import { SongList } from "../components/SongList";
import { PlayerBar } from "../components/PlayerBar";
import { listSongs, getSongStreamUrl } from "../api/songs";
import { useAuth } from "../contexts/AuthContext";
import { usePlayer } from "../contexts/PlayerContext";
import { useToast } from "../contexts/ToastContext";

function normalizeListResponse(data) {
  // Backend might return:
  // - array of songs
  // - { items: [...] }
  // - { songs: [...] }
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.songs)) return data.songs;
  return [];
}

// PUBLIC_INTERFACE
export function LibraryPage() {
  /** Authenticated page showing upload + library + player. */
  const { token } = useAuth();
  const { loadAndPlay } = usePlayer();
  const { pushToast } = useToast();

  const [songs, setSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [songsError, setSongsError] = useState("");

  const refreshSongs = useCallback(async () => {
    setSongsError("");
    setLoadingSongs(true);
    try {
      const data = await listSongs({ token });
      setSongs(normalizeListResponse(data));
    } catch (err) {
      const msg = err?.message || "Failed to load songs.";
      setSongsError(msg);
      pushToast({
        type: "error",
        title: "Could not load library",
        message: msg,
      });
    } finally {
      setLoadingSongs(false);
    }
  }, [token, pushToast]);

  useEffect(() => {
    refreshSongs();
  }, [refreshSongs]);

  const handlePlay = async (song) => {
    if (!song?.id) {
      pushToast({ type: "error", title: "Cannot play", message: "This song is missing an id from the server response." });
      return;
    }
    const streamUrl = getSongStreamUrl({ songId: song.id });
    await loadAndPlay({ song, streamUrl });
  };

  return (
    <div className="app-shell">
      <Header />

      <main className="main">
        <div className="container">
          <div className="grid">
            <section className="card" aria-label="Upload">
              <div className="card-header">
                <div>
                  <h2>Upload</h2>
                  <p>Add mp3 files to your library</p>
                </div>
              </div>
              <div className="card-body">
                <UploadForm onUploaded={refreshSongs} />
              </div>
            </section>

            <section className="card" aria-label="Library">
              <div className="card-header">
                <div>
                  <h2>Library</h2>
                  <p>Your uploaded songs</p>
                </div>
                <button className="btn btn-small" type="button" onClick={refreshSongs} disabled={loadingSongs}>
                  Refresh
                </button>
              </div>

              <SongList
                songs={songs}
                loading={loadingSongs}
                error={songsError}
                onPlay={handlePlay}
                onRefresh={refreshSongs}
              />
            </section>
          </div>
        </div>
      </main>

      <PlayerBar />
    </div>
  );
}
