import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { IUserPayload } from "types/custom";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUserPayload;
  }
}

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.sendStatus(401);
      return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
      if (error) {
        res.sendStatus(403);
        return;
      }

      req.user = payload as IUserPayload;
      next();
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
};

export const checkAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.sendStatus(401);
      return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
      if (error) {
        res.sendStatus(403);
        return;
      }

      if ((payload as IUserPayload).role !== "admin") {
        res.sendStatus(403);
        return;
      }

      req.user = payload as IUserPayload;
      next();
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
};
