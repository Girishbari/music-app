"use client";
import React, { useState, useEffect, useRef } from "react";
import AudioControls from "./audioControls";

const AudioPlayer = ({ tracks }: { tracks: any }) => {
  // State
  const [trackIndex, setTrackIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Destructure for conciseness
  const { title_short, artist, preview, duration } = tracks[trackIndex];

  // Refs
  const audioRef = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("") : undefined
  );
  const intervalRef = useRef();
  const isReady = useRef(false);

  // Destructure for conciseness

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    /* @ts-expect-error */
    intervalRef.current = setInterval(() => {
      if (audioRef.current && audioRef.current.ended) {
        toNextTrack();
      } else {
        setTrackProgress(audioRef.current ? audioRef.current.currentTime : 0);
      }
    }, 1000);
  };

  /* @ts-expect-error */

  const onScrub = (value) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    audioRef.current!.currentTime = value;
    setTrackProgress(audioRef.current ? audioRef.current.currentTime : 0);
  };

  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  const toPrevTrack = () => {
    if (trackIndex - 1 < 0) {
      setTrackIndex(tracks.length - 1);
    } else {
      setTrackIndex(trackIndex - 1);
    }
  };

  const toNextTrack = () => {
    if (trackIndex < tracks.length - 1) {
      setTrackIndex(trackIndex + 1);
    } else {
      setTrackIndex(0);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      startTimer();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  // Handles cleanup and setup when changing tracks
  useEffect(() => {
    audioRef.current?.pause();

    audioRef.current = new Audio(preview);
    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
    }
  }, [trackIndex]);

  useEffect(() => {
    /* @ts-ignore */
    return () => {
      audioRef.current?.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="audio-player">
      <div className="track-info">
        <img
          className="artwork"
          src={"image"}
          alt={`track artwork for ${title_short} by ${artist.name}`}
        />
        <h2 className="title_short">{title_short}</h2>
        <h3 className="artist">{artist.name}</h3>
        <AudioControls
          isPlaying={isPlaying}
          onPrevClick={toPrevTrack}
          onNextClick={toNextTrack}
          onPlayPauseClick={setIsPlaying}
        />
        <input
          type="range"
          value={trackProgress}
          step="1"
          min="0"
          max={duration ? duration : `${duration}`}
          className="progress"
          onChange={(e) => onScrub(e.target.value)}
          onMouseUp={onScrubEnd}
          onKeyUp={onScrubEnd}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
