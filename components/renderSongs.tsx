"use client";

import { Music2Icon, PlusIcon, Play, Pause } from "lucide-react";
import React, { Fragment, useContext, useId } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HelperContext } from "@/context/HelperContext";
import { useToast } from "./ui/use-toast";

enum songPage {
  allSongs,
  playlistSongs,
}

export default function RenderSongs({
  songsArr,
  typeOfRender,
}: {
  songsArr: any[];
  typeOfRender: songPage;
}) {
  const { toast } = useToast();

  function formatSeconds(second: number) {
    const minutes = Math.floor(second / 60);
    const seconds = second - minutes * 60;
    return `${minutes} : ${seconds}`;
  }

  let playlists = [];
  if (typeof window !== "undefined") {
    const storedPlaylists = window.localStorage.getItem("playlists");
    playlists = storedPlaylists ? JSON.parse(storedPlaylists) : []; // Parse playlists from localStorage
    window.localStorage.setItem("songs", JSON.stringify(songsArr ?? ""));
  }

  const { trackIndex, setTrackIndex, isPlaying, setIsPlaying } =
    useContext(HelperContext);

  let songsJsx = [];

  for (const [
    index1,
    { title_short, artist, duration, preview },
    // @ts-ignore
  ] of songsArr.entries() || []) {
    songsJsx.push(
      <div
        className="flex items-center justify-between rounded-md bg-[#EFEFF4] p-2 text-sm font-medium hover:bg-[#EFEFF4]/50"
        key={useId()}
      >
        <div className="flex items-center gap-2">
          <Music2Icon className="h-5 w-5 text-[#6F7073]" />
          <div>
            <div className="line-clamp-1">{title_short}</div>
            <div className="text-xs text-[#6F7073]">{artist.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-xs text-[#6F7073]">
            {formatSeconds(duration)}
          </div>
          <Button size="icon" variant="ghost">
            {trackIndex === index1 && isPlaying ? (
              <Pause
                className="h-4 w-4"
                onClick={() => {
                  setTrackIndex(index1);
                  setIsPlaying(false);
                }}
              />
            ) : (
              <Play
                className="h-4 w-4"
                onClick={() => {
                  setTrackIndex(index1);
                  setIsPlaying(true);
                }}
              />
            )}
          </Button>
          {typeOfRender === songPage.allSongs && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only">Add to Playlist</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-10">
                <DropdownMenuLabel>Your Playlists</DropdownMenuLabel>
                {Array.isArray(playlists) && playlists.length > 0 ? (
                  playlists.map((pl: any, index: any) => (
                    <Fragment key={index}>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            const existingData = JSON.parse(
                              window.localStorage.getItem(pl.name) || "[]"
                            );

                            const newData = [
                              ...existingData,
                              {
                                index: index1,
                                title_short: title_short,
                                artist: artist,
                                duration: duration,
                                preview: preview,
                              },
                            ];

                            window.localStorage.setItem(
                              pl.name,
                              JSON.stringify(newData)
                            );
                          }
                        }}
                      >
                        {pl.name}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </Fragment>
                  ))
                ) : (
                  <DropdownMenuItem>Make Playlist</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">All Songs</h2>
      <div className="mt-2 grid gap-2">{songsJsx}</div>
    </div>
  );
}
