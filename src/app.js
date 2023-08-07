import express from "express";
import cors from "cors";
import router from "./routes";
import socket from "socket.io";
import mongoose from "mongoose";
import { errorHandler } from "./helpers/multer";
import "dotenv/config";

const app = express();
const port = process.env.PORT;
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

// const chatBot = "CHAT_BOT";
// let chatRoom = "";
// let allUsers = [];
// let chatRoomUsers = [];

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

try {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("🎉🎉 MONGO DATABASE CONNECTED SUCCESSFULLY 🎉🎉");
    })
    .catch((error) => {
      console.log("🚨🚨 FAILED TO CONNECT TO MONGO DATABASE 🚨🚨", error);
    });

  app.use("/profile", express.static("upload/images"));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use("/api/v2", router);
  app.use("*", (req, res) => {
    res.status(404).json({
      error: "Route Not Found!",
    });
  });
  app.use(errorHandler);

  const server = app.listen(port, () => {
    console.log(`app listening on http://localhost:${port}`);
  });

  const io = socket(server, {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  });

  global.onlineUsers = new Map();

  io.on("connection", (socket) => {
    global.chatSocket = socket;

    socket.on("add_user", (data) => {
      onlineUsers.set(data.userId, socket.id);
      addUser(data.userId, socket.id);
    });

    socket.on("send_message", (data) => {
      const user = getUser(data.to);
      const receiver = onlineUsers.get(data.to);

      if (receiver) {
        io.to(receiver).emit("receive_message", data);
      }
    });
  });
} catch (error) {
  console.log(error);
}

export default app;
