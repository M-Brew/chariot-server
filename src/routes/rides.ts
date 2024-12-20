import { Router, Request, Response } from "express";
import dotenv from "dotenv";

import Ride from "../models/ride.model";
import { rideValidation } from "../validation/rideValidation";

dotenv.config();

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const { valid, errors } = rideValidation(payload);
    if (!valid) {
      res.status(400).json(errors);
      return;
    }

    const newRide = new Ride(payload);
    const ride = await newRide.save();

    res.status(201).json(ride);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const rides = await Ride.find();

    res.status(200).json(rides);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ride = await Ride.findById(id);
    if (!ride) {
      res.status(404).json({ error: "Ride not found" });
      return;
    }

    res.status(200).json(ride);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const ride = await Ride.findById(id);
    if (!ride) {
      res.status(404).json({ error: "Ride not found" });
      return;
    }

    const updatedRide = await Ride.findByIdAndUpdate(id, payload, {
      new: true,
      useFindAndModify: false,
    });

    res.status(200).json(updatedRide);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ride = await Ride.findById(id);
    if (!ride) {
      res.status(404).json({ error: "Ride not found" });
      return;
    }

    await Ride.findByIdAndDelete(id);

    res.sendStatus(204);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

export default router;
