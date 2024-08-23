// @ts-nocheck
"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  SkipBackIcon,
  PlayIcon,
  SkipForwardIcon,
  Volume2Icon,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { HelperContext } from "@/context/HelperContext";

export default function Footer({
  tracks,
  typeOfRender,
}: {
  tracks: any;
  typeOfRender: any;
}) {
  const [trackProgress, setTrackProgress] = useState(0);
  const { trackIndex, setTrackIndex, isPlaying, setIsPlaying } =
    useContext(HelperContext);

  const {
    title_short,
    artist,
    preview,
    duration,
  }: {
    title_short: string;
    artist: { name: string };
    preview: string;
    duration: string;
  } = tracks[trackIndex] || {};

  const [currentTime, setCurrentTime] = useState("0:00");

  // Refs
  const audioRef = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("") : undefined
  );
  const intervalRef = useRef<number | undefined>(undefined);
  const isReady = useRef(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      if (audioRef.current && audioRef.current.ended) {
        toNextTrack();
      } else {
        setTrackProgress(audioRef.current ? audioRef.current.currentTime : 0);
      }
    }, 1000);
  };

  const onScrub = (value: number) => {
    clearInterval(intervalRef.current);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setTrackProgress(value);
    }
  };

  const onScrubEnd = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();

    // Store progress in localStorage
    const songs = JSON.parse(localStorage.getItem("songsProgress") || "{}");
    const newSongs = {
      ...songs,
      [trackIndex]: trackProgress,
    };
    localStorage.setItem("songsProgress", JSON.stringify(newSongs));
  };

  const toPrevTrack = () => {
    storeTrackProgress(); // Store current progress
    if (trackIndex - 1 < 0) {
      setTrackIndex(tracks.length - 1);
    } else {
      setTrackIndex(trackIndex - 1);
    }
  };

  const toNextTrack = () => {
    storeTrackProgress(); // Store current progress
    if (trackIndex < tracks.length - 1) {
      setTrackIndex(trackIndex + 1);
    } else {
      setTrackIndex(0);
    }
  };

  const storeTrackProgress = () => {
    const songs = JSON.parse(localStorage.getItem("songsProgress") || "{}");
    const newSongs = {
      ...songs,
      [trackIndex]: trackProgress,
    };
    localStorage.setItem("songsProgress", JSON.stringify(newSongs));
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      startTimer();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current?.pause();

    audioRef.current = new Audio(preview);
    const savedProgress = JSON.parse(
      localStorage.getItem("songsProgress") || "{}"
    );

    if (savedProgress[trackIndex] !== undefined) {
      const progressValue = savedProgress[trackIndex];
      audioRef.current.currentTime = progressValue;
      setTrackProgress(progressValue);
    }

    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      isReady.current = true;
    }
  }, [trackIndex]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <footer className="border-t bg-muted/40 p-3 md:p-6">
      <div className="flex items-center justify-between md:justify-around">
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-5">
          <div className="w-[50%] text-left">
            <div className="text-sm whitespace-nowrap">{title_short}</div>
            <div className="  text-xs text-[#6F7073] whitespace-nowrap">
              {artist.name}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:w-fit items-center gap-2 w-[50%] ">
          <AudioControls
            isPlaying={isPlaying}
            onPrevClick={toPrevTrack}
            onNextClick={toNextTrack}
            onPlayPauseClick={setIsPlaying}
          />
          <div className="flex gap-1 text-sm text-gray-400">
            <span id="current-time">{"0: 00"}</span>
            <span id="duration">
              {audioRef.current?.duration
                ? formatTime(audioRef.current?.duration)
                : "0:00"}
            </span>
          </div>
          <input
            type="range"
            value={trackProgress}
            step="1"
            min="0"
            max={audioRef.current?.duration || 0}
            className="cursor-pointer max-w-[100px] md:w-[200px] [&>span:first-child]:h-1 [&>span:first-child]:bg-[#6F7073] [&_[role=slider]]:bg-[#161680] [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-[#161619] [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
            onChange={(e) => onScrub(e.target.value)}
            onMouseUp={onScrubEnd}
            onKeyUp={onScrubEnd}
          />
        </div>
      </div>
    </footer>
  );
}

const AudioControls = ({
  isPlaying,
  onPlayPauseClick,
  onPrevClick,
  onNextClick,
}: {
  isPlaying: any;
  onPlayPauseClick: any;
  onPrevClick: any;
  onNextClick: any;
}) => (
  <div className="inline">
    <Button size="icon" variant="ghost" onClick={onPrevClick}>
      <SkipBackIcon className="h-5 w-5" />
      <span className="sr-only">Previous</span>
    </Button>

    {isPlaying ? (
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onPlayPauseClick(false)}
      >
        <Pause className="h-5 w-5" />
        <span className="sr-only">Pause</span>
      </Button>
    ) : (
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onPlayPauseClick(true)}
      >
        <PlayIcon className="h-5 w-5" />
        <span className="sr-only">Play</span>
      </Button>
    )}
    <Button size="icon" variant="ghost" onClick={onNextClick}>
      <SkipForwardIcon className="h-5 w-5" />
      <span className="sr-only">Next</span>
    </Button>
  </div>
);
