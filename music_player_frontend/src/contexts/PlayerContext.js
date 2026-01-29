import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const PlayerContext = createContext(null);

// PUBLIC_INTERFACE
export function PlayerProvider({ children }) {
  /** Provides player state: current song and play/pause controls. */
  const audioRef = useRef(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const loadAndPlay = useCallback(async ({ song, streamUrl }) => {
    setCurrentSong({ ...song, streamUrl });
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = streamUrl;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      // Autoplay may be blocked; user can press play manually.
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const onEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const api = useMemo(
    () => ({
      audioRef,
      currentSong,
      isPlaying,
      setCurrentSong,
      loadAndPlay,
      togglePlay,
      onEnded,
    }),
    [currentSong, isPlaying, loadAndPlay, togglePlay, onEnded]
  );

  return <PlayerContext.Provider value={api}>{children}</PlayerContext.Provider>;
}

// PUBLIC_INTERFACE
export function usePlayer() {
  /** Hook to access player state/actions. */
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
