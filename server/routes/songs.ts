import { Router } from "express";
import { Song } from "../models/song.model";
import { User } from "../models/auth.model";
import { Playlist } from "../models/playlist.model";
import { Types } from "mongoose";

const router = Router();

router.get("/getAll", async (req, res) => {
  try {
    const songs = await Song.find({}).select(
      "-artist.picture_small -artist.picture_medium"
    );
    if (songs.length === 0) {
      throw new Error("No songs found");
    }
    res.status(200).json({
      message: "Songs retrieved successfully",
      count: songs.length,
      data: songs,
    });
  } catch (error) {
    console.error("Error retrieving songs:", error);
    res.status(500).json({ message: "Error retrieving songs", error: error });
  }
});

router.post("/addAll", async (req, res) => {
  try {
    req.body.data.map(async (obj: any, index: number) => {
      console.log(index);
      await Song.create(obj);
    });

    res.status(201).json({
      message: "Song added successfully",
    });
  } catch (error) {
    console.error("Error adding song:", error);
    res.status(500).json({ message: "Error adding song", error: error });
  }
});

router.post("/createById", async (req, res) => {
  try {
    const { userId, playlist_name } = req.body;

    if (!userId || !playlist_name) {
      throw new Error("Invalid fields");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const isCreated = await Playlist.create({
      name: playlist_name,
      songs: [],
    });

    if (!isCreated) {
      throw new Error("Error in creating playlist");
    }

    const isAdded = await User.findByIdAndUpdate(
      userId,
      {
        $push: { playlists: isCreated._id },
      },
      {
        new: true,
      }
    );

    if (!isAdded) {
      throw new Error("Error in adding playlist to user collection");
    }
    res.status(200).json({
      message: "Playlist created successfully",
      data: {
        Playlist: isAdded?.playlists,
      },
    });
  } catch (error: any) {
    console.log("Error in creating playlist", error);
    res
      .status(500)
      .json({ message: "Error in creating playlist", error: error.message });
  }
});

router.put("/addByName", async (req, res) => {
  try {
    const { playlist_name, songId } = req.body;

    const isExists = await Playlist.findOneAndUpdate(
      {
        name: playlist_name,
      },
      {
        $push: {
          songs: songId,
        },
      },
      {
        new: true,
      }
    );

    if (!isExists) {
      throw new Error("Playlist with given name not exists");
    }

    res.status(200).json({
      message: "added song sucessfully",
      data: { playlist: isExists },
    });
  } catch (error: any) {
    console.error(error), res.status(500).json({ error: error.message });
  }
});

router.get("/getByName", async (req, res) => {
  try {
    const { playlist_name } = req.query;

    const isPlaylistExists = await Playlist.findById({
      name: playlist_name,
    })
      .populate("songs")
      .exec();

    console.log(isPlaylistExists);
    let newArr: [] = [];

    if (!isPlaylistExists) {
      throw new Error("Playlist with given name not exists");
    }

    res.status(200).json({
      message: "retrieved sucessfully",
      data: isPlaylistExists?.songs,
    });
  } catch (error: any) {
    console.error(error), res.status(500).json({ error: error.message });
  }
});

export default router;
