import User from "../models/user";

export class UserService {
  async addUser(data) {
    const user = await User.create(data);
    return user;
  }

  async getAllUsers() {
    const users = await User.find();
    return users;
  }

  async getOtherUsers(id) {
    const users = await User.find({
      _id: { $ne: id },
    });
    return users;
  }

  async loginUser(email) {
    const user = await User.findOne({
      email,
    });
    return user;
  }

  async deleteUsers() {
    return await User.deleteMany();
  }

  async deleteOneUser(id) {
    return await User.deleteOne({ _id: id });
  }
}
