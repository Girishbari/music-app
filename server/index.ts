import express, { Express, Request, Response } from "express";
import userRouter from "./routes/auth";
import songRouter from "./routes/songs";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";

const app: Express = express();
const port = 4000;
app.use(express.json());
app.use(cors());
app.use("/api/songs", songRouter);
app.use("/api/auth", userRouter);

app.use("*", (req, res) => {
  res.json({ message: "hello" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  mongoose.connect(
    "mongodb+srv://Girish:12345678%40Yes@cluster0.05nqmau.mongodb.net/",
    { dbName: "music" } as ConnectOptions
  );
});
