import { generateToken } from "../helpers/jwtFunctions";
import { comparePassword, hashPassword } from "../helpers/passwordHash";
import User from "../models/user";
import { UserService } from "../services/user.service";

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async addUser(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      const emailExists = await User.findOne({ email });

      if (
        firstName === "" ||
        lastName === "" ||
        email === "" ||
        password === ""
      ) {
        return res.status(400).json({
          message: "Fill out all the fields please",
        });
      }
      if (emailExists) {
        return res.status(409).json({
          message: "This email is taken",
        });
      }

      if (req.file) {
        req.body.picture = `http://localhost:4004/profile/${req.file.filename}`;
      }

      const newUser = await this.userService.addUser({
        firstName,
        lastName,
        email,
        password: hashPassword(password),
        picture: req.body.picture,
      });

      return res.status(201).json({
        message: `Successfully registered ${firstName}`,
        data: newUser,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error while adding a user",
        error: error.message,
      });
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await this.userService.loginUser(email);

      if (email === "" || password === "") {
        return res.status(404).json({
          message: "Please provide an email and password",
        });
      }

      if (!user) {
        return res.status(404).json({
          message: "Incorrect email or password",
        });
      }

      const validPassword = await comparePassword(password, user.password);

      if (!validPassword) {
        return res.status(404).json({
          message: "Incorrect email or password",
        });
      }

      const token = generateToken({ id: user._id }, "7d");

      return res.status(200).json({
        message: "User successfully signed in",
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Login failed",
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.userService.getAllUsers();

      return res.status(200).json({
        message: "Successfully fetched users",
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error while fetching users",
        error: error.message,
      });
    }
  }

  async getOtherUsers(req, res) {
    try {
      const { id } = req.params;

      const users = await this.userService.getOtherUsers(id);

      return res.status(201).json({
        message: "Successfully fetched other users",
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error while fetching users",
        error: error.message,
      });
    }
  }

  async deleteUsers(req, res) {
    try {
      await this.userService.deleteUsers();

      return res.status(201).json({
        message: "Successfully deleted users",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error while deleting users",
        error: error.message,
      });
    }
  }

  async deleteOneUser(req, res) {
    try {
      const { id } = req.params;

      await this.userService.deleteOneUser(id);

      return res.status(200).json({
        message: "Successfully deleted one user",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to delete one user",
        error: error.message,
      });
    }
  }
}
