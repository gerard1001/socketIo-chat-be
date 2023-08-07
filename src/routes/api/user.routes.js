import express from "express";
import { UserController } from "../../controllers/user.controller";
import { upload } from "../../helpers/multer";

const routes = express.Router();

routes.post("/register", upload.single("picture"), async (req, res) => {
  return new UserController().addUser(req, res);
});

routes.post("/login", async (req, res) => {
  return new UserController().loginUser(req, res);
});

routes.get("/", async (req, res) => {
  return new UserController().getAllUsers(req, res);
});

routes.get("/:id", async (req, res) => {
  return new UserController().getOtherUsers(req, res);
});

routes.delete("/", async (req, res) => {
  return new UserController().deleteUsers(req, res);
});

routes.delete("/:id", async (req, res) => {
  return new UserController().deleteOneUser(req, res);
});

export default routes;
