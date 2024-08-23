import mongoose, { Document, Schema, Types } from "mongoose";

interface ISongs extends Document {
  title_short: string;
  duration: number;
  preview: string;
  artist: {
    name: string;
    picture_small: string;
    picture_medium: string;
  };
}

const songsSchema: Schema = new Schema({
  title_short: { type: String, required: true },
  duration: { type: Number, required: true },
  preview: { type: String, default: null },
  artist: {
    name: { type: String, reuqired: true },
    picture_small: { type: String, default: null },
    picture_medium: { type: String, default: null },
  },
});

export const Song = mongoose.model<ISongs>("Song", songsSchema);
