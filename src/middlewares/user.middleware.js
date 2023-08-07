import { checkToken, decodeToken } from "../helpers/jwtFunctions";
import User from "../models/user";

export const checkUserLoggedIn = async (req, res, next) => {
  try {
    const token = await checkToken(req);

    if (!token) {
      return res.status(401).json({ message: "Please log in" });
    }

    let decoded;

    try {
      decoded = decodeToken(token);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.decoded = decoded;

    return next();
  } catch (error) {
    return res.status(500).json({
      message: "Unauthorized",
    });
  }
};
