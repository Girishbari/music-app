"use client";
import { Badge, PlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormEvent, useContext, useEffect, useId, useState } from "react";
import { HelperContext } from "@/context/HelperContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "@radix-ui/react-label";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { toast, useToast } from "./ui/use-toast";

export default function Sidebar() {
  const { isOpen } = useContext(HelperContext);

  const [userPlaylist, setUserPlaylist] = useState(null);

  let userId = "";
  if (typeof window !== "undefined") {
    userId = window?.localStorage.getItem("userId") || "";
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPlaylists = window.localStorage.getItem("playlists");
      if (storedPlaylists) {
        try {
          // @ts-ignore
          setUserPlaylist(storedPlaylists);
        } catch (error) {
          console.error("Error parsing JSON from localStorage:", error);
          setUserPlaylist(null);
        }
      } else {
        setUserPlaylist(null);
      }
    }
  }, []);

  return (
    <>
      <div className={`hidden md:block border-r bg-[#EFEFF4]/20 p-4`}>
        <MenuItems playlists={userPlaylist || {}} />
      </div>
      {isOpen && (
        <div
          className={`'  ${isOpen ? "translate-x-0" : "-translate-x-full"}
                  ${isOpen ? "animate-slide-in" : "animate-slide-out"}' 
                  border-r bg-white  shadow-md fixed top-0 left- bg-opacity-50 backdrop-blur-sm z-50  w-[50%] h-[100%]  md:hidden`}
        >
          <div className=" bg-[#EFEFF4]/20 p-4 rounded ">
            <MenuItems playlists={userPlaylist || {}} />
          </div>
        </div>
      )}
    </>
  );
}

function MenuItems({ playlists }: { playlists: {} }) {
  const [pl, setPl] = useState(playlists);
  const [userId, setUserId] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast({
          title: "Oh, you might need to login first",
          variant: "default",
        });
        return;
      }

      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get("name") as string;
      setPl({
        ...pl,
        [name]: {
          name: name,
          songs: [],
        },
      });

      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/songs/createById`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playlist_name: name,
            userId: JSON.parse(userId),
          }),
        }
      );

      if (!resp.ok) {
        const errorData = await resp.json();
        console.log(errorData);
        setPl(playlists);
        const errorMessage = errorData.error || "Cannot create Playlist";
        throw new Error(errorMessage);
      }
      const response = await resp.json();
      console.log(response);
      const newPl = JSON.stringify({
        ...playlists,
        [name]: { name: name, songs: [] },
      });
      window.localStorage.setItem("playlists", newPl);
      toast({
        title: "Created",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      });
      console.error("Error while creating playlist", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Music App</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <PlusIcon className="h-5 w-5" />
              <span className="sr-only">Create Playlist</span>
            </Button>
          </DialogTrigger>
          <Popup submitMethod={handleSubmit} />
        </Dialog>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-medium">Your Playlists</h2>
          <div className="mt-2 grid gap-2">
            {pl && Object.keys(pl).length < 1 ? (
              <div className="flex flex-col gap-2 items-center mt-3">
                <label className="text-xl">Nothing to show</label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-fit">Create Playlist</Button>
                  </DialogTrigger>
                  ``
                  <Popup submitMethod={handleSubmit} />
                </Dialog>
              </div>
            ) : (
              /* @ts-ignore */
              Object.values(pl).map((pl: { _id: string; name: string }) => {
                return (
                  <Link
                    href={`/${pl.name}`}
                    className="flex items-center justify-between rounded-md bg-[#EFEFF4] p-2 text-sm font-medium hover:bg-[#EFEFF4]/50"
                    prefetch={false}
                    key={Math.floor(Math.random() * 100)}
                  >
                    <span>{pl.name}</span>
                    <Badge>12</Badge>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Popup({
  submitMethod,
}: {
  submitMethod: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Make Playlist</DialogTitle>
        <DialogDescription>
          Add songs to this playlist later, give your Playlist Name here first
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={submitMethod}>
        <div className="grid gap-4 py-4">
          <Input
            id="name"
            name="name"
            placeholder="rocking"
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <Button type="submit">Let's go</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
