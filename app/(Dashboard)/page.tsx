import AudioPlayer from "@/components/audioPlayer";
import Footer from "@/components/footer";
import RenderSongs from "@/components/renderSongs";
import { toast } from "@/components/ui/use-toast";

enum songPage {
  allSongs,
  playlistSongs,
}

export default async function Home() {
  let songs: [] = [];

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/songs/getAll`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error("Cannot get all songs");
  } else {
    songs = json.data;
  }

  return (
    <>
      <main className="flex-1 overflow-auto">
        <div className="grid gap-4 p-4 md:p-6">
          <RenderSongs songsArr={songs} typeOfRender={songPage.allSongs} />
        </div>
      </main>
      <Footer tracks={songs} typeOfRender={songPage.allSongs} />
    </>
  );
}
