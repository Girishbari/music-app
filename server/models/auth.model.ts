import mongoose, { Document, Schema, Types } from "mongoose";
import { generate, verify } from "password-hash";

interface IUser extends Document {
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  playlists: {};
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  playlists: [{ type: Types.ObjectId, ref: "Playlist", default: [] }],
});

UserSchema.pre<IUser>("save", async function (next) {
  const hashedPassword = generate(this.password, { saltLength: 10 });
  this.password = hashedPassword;
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return verify(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
