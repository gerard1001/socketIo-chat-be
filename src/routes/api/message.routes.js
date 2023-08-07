import express from "express";
import { MessageController } from "../../controllers/message.controller";
import { checkUserLoggedIn } from "../../middlewares/user.middleware";
import { upload } from "../../helpers/multer";

const routes = express.Router();

routes.post(
  "/",
  upload.single("picture"),
  checkUserLoggedIn,
  async (req, res) => {
    return new MessageController().addMessage(req, res);
  }
);

routes.get("/", async (req, res) => {
  return new MessageController().getAllMessages(req, res);
});

routes.post("/get", checkUserLoggedIn, async (req, res) => {
  return new MessageController().getUsersMessages(req, res);
});

routes.delete("/", async (req, res) => {
  return new MessageController().deleteAllMessages(req, res);
});

export default routes;
