"use client";

import Footer from "@/components/footer";
import RenderSongs from "@/components/renderSongs";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

enum songPage {
  allSongs,
  playlistSongs,
}
export default function page() {
  const { toast } = useToast();
  const params = useParams<{ tag: string; item: string }>();

  // const [songs, setSongs] = useState<[]>([]);

  let songs = [];

  if (typeof window !== "undefined") {
    /* @ts-ignore */
    songs = window?.localStorage.getItem(`${params.playlist}`) || [];
  }

  return (
    <>
      <main className="flex-1 overflow-auto">
        <div className="grid gap-4 p-4 md:p-6">
          <RenderSongs songsArr={songs} typeOfRender={songPage.playlistSongs} />
        </div>
      </main>
      <Footer tracks={songs} typeOfRender={songPage.allSongs} />
    </>
  );
}
