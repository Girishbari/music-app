import express, { Router } from "express";
import { User } from "../models/auth.model";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      throw new Error("User already Exists");
    }

    const user = await User.create({ email, password });

    if (!user) {
      throw new Error("Internal server error");
    }
    res.status(201).json({
      message: "User Created sucessfully",
      data: { email: user.email, playlists: user.playlists, _id: user._id },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error signing up", error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUserExists = await User.findOne({ email }).populate("playlists");
    if (!isUserExists) {
      throw new Error("Email is not registered");
    }

    const isMatch = await isUserExists.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    res.json({
      message: "Sign in successfully",
      data: {
        email: isUserExists.email,
        playlists: isUserExists.playlists,
        _id: isUserExists._id,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error signing in", error: error.message });
  }
});

export default router;
