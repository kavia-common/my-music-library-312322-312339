import React from "react";
import { usePlayer } from "../contexts/PlayerContext";

// PUBLIC_INTERFACE
export function PlayerBar() {
  /** Fixed bottom audio player bar. */
  const { audioRef, currentSong, isPlaying, togglePlay, onEnded } = usePlayer();

  return (
    <div className="player-bar" role="region" aria-label="Audio player">
      <div className="player-inner">
        <div className="player-meta">
          <strong>{currentSong ? currentSong.title : "Nothing playing"}</strong>
          <span>
            {currentSong
              ? currentSong.artist
                ? currentSong.artist
                : "Unknown artist"
              : "Select a song from your library"}
          </span>
        </div>

        <div className="player-controls">
          <button
            className="btn btn-small"
            type="button"
            onClick={togglePlay}
            disabled={!currentSong}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          <audio
            ref={audioRef}
            className="audio"
            controls
            preload="none"
            onEnded={onEnded}
          />
        </div>
      </div>
    </div>
  );
}
