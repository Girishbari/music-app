import mongoose, { Document, Schema, Types } from "mongoose";

interface IPlaylist extends Document {
  name: string;
  user: string;
  songs: [];
}

const playlistSchema = new Schema({
  name: { type: String },
  songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
});

export const Playlist = mongoose.model<IPlaylist>("Playlist", playlistSchema);
