import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { IUserPayload } from "types/custom";

export const generateAccessToken = (payload: IUserPayload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "300s",
  });
};

export const generateRefreshToken = (payload: IUserPayload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
};
