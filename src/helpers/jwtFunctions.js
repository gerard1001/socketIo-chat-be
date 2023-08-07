import jwt from "jsonwebtoken";
import "dotenv/config";

const secret = process.env.JWT_SECRET;

export const generateToken = (payload, expiresIn = process.env.EXPIRES_IN) => {
  const token = jwt.sign({ ...payload }, secret, { expiresIn });
  return token;
};

export const decodeToken = async (token) => {
  const decoded = jwt.verify(token, secret);
  return decoded;
};

export const checkToken = async (req) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  return token;
};
