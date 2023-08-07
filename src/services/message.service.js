import Message from "../models/message";

export class MessageService {
  async addMessage(data) {
    const message = await Message.create(data);
    return message;
  }

  async getAllMessages() {
    const messages = await Message.find();
    return messages;
  }

  async getUsersMessages(arr) {
    const messages = await Message.find({
      users: {
        $all: arr,
      },
    }).sort({ updatedAt: 1 });
    return messages;
  }

  async deleteAllMessages() {
    return await Message.deleteMany();
  }
}
