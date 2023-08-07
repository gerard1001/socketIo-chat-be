import { checkToken, decodeToken } from "../helpers/jwtFunctions";
import { MessageService } from "../services/message.service";

export class MessageController {
  constructor() {
    this.messageService = new MessageService();
  }

  async addMessage(req, res) {
    try {
      const { to, message } = req.body;
      const token = await checkToken(req);
      const decoded = await decodeToken(token);

      let toArr = to.split(", ");

      const users = [...toArr, decoded.id];

      if (req.file) {
        req.body.picture = `http://localhost:4004/profile/${req.file.filename}`;
      }

      const newMessage = await this.messageService.addMessage({
        message: { text: message },
        picture: req.body.picture,
        users: users,
        sender: decoded.id,
      });

      return res.status(201).json({
        message: "Successfully added message",
        data: newMessage,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to add message",
        error: error.message,
      });
    }
  }

  async getAllMessages(req, res) {
    try {
      const messages = await this.messageService.getAllMessages();

      return res.status(200).json({
        message: "Successfully fetched messages",
        data: messages,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch messages",
        error: error.message,
      });
    }
  }

  async getUsersMessages(req, res) {
    try {
      const { to } = req.body;
      const token = await checkToken(req);
      const decoded = await decodeToken(token);

      const arr = [...to, decoded.id];

      const messages = await this.messageService.getUsersMessages(arr);

      return res.status(200).json({
        message: "Successfully fetched users messages",
        data: messages,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch users messages",
        error: error.message,
      });
    }
  }

  async deleteAllMessages(req, res) {
    try {
      await this.messageService.deleteAllMessages();

      return res.status(200).json({
        message: "Successfully deleted messages",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to delete messages",
        error: error.message,
      });
    }
  }
}
