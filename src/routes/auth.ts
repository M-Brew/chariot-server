import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/user.model";
import RefreshToken from "../models/refreshToken.model";

import {
  signInValidation,
  signUpValidation,
} from "../validation/authValidation";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import { IUserPayload } from "types/custom";
import { checkAuth } from "../middlewares/checkAuth";

const router = Router();

router.post("/sign-up", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const { valid, errors } = signUpValidation({
      firstName,
      lastName,
      email,
      password,
    });
    if (!valid) {
      res.status(400).json({ errors });
      return;
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ error: "User with email exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const payload: IUserPayload = {
      id: newUser._id.toString(),
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      role: newUser.role,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await new RefreshToken({ token: refreshToken }).save();

    res.status(201).json({
      accessToken,
      refreshToken,
    });
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});

router.post("/sign-in", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { valid, errors } = signInValidation({ email, password });
    if (!valid) {
      res.status(400).json({ errors });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const payload: IUserPayload = {
      id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await new RefreshToken({ token: refreshToken }).save();

    res.status(200).json({
      accessToken,
      refreshToken,
    });
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});

router.post("/admin-sign-in", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { valid, errors } = signInValidation({ email, password });
    if (!valid) {
      res.status(400).json({ errors });
      return;
    }

    const user = await User.findOne({ email, role: "admin" });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const payload: IUserPayload = {
      id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await new RefreshToken({ token: refreshToken }).save();

    res.status(200).json({
      accessToken,
      refreshToken,
    });
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});

router.post("/token", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.sendStatus(401);
      return;
    }

    const refreshToken = await RefreshToken.findOne({ token });
    if (!refreshToken) {
      res.sendStatus(403);
      return;
    }

    const payload = jwt.verify(
      refreshToken.token,
      process.env.REFRESH_TOKEN_SECRET
    ) as IUserPayload;
    const accessToken = generateAccessToken({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    });

    res.status(200).json({ accessToken });
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});

router.get("/data", checkAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user;
    res.status(200).json(user);
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});

router.post("/sign-out", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.sendStatus(401);
      return;
    }

    const refreshToken = await RefreshToken.findOne({ token });
    if (!refreshToken) {
      res.sendStatus(401);
      return;
    }

    await RefreshToken.findByIdAndDelete(refreshToken._id);

    res.sendStatus(204);
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});

export default router;
