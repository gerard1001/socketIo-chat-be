import express from "express";
import userRoutes from "./api/user.routes";
import messageRoutes from "./api/message.routes";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/message", messageRoutes);

export default router;
