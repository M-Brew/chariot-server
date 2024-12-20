import { Router, Request, Response } from "express";
import dotenv from "dotenv";

import Car from "../models/car.model";
import { carValidation } from "../validation/carValidation";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/s3";
import { upload } from "../middlewares/uploadFile";

dotenv.config();

const { S3_BUCKET_NAME } = process.env;

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const { valid, errors } = carValidation(payload);
    if (!valid) {
      res.status(400).json(errors);
      return;
    }

    const newCar = new Car(payload);
    const car = await newCar.save();

    res.status(201).json(car);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const cars = await Car.find();

    res.status(200).json(cars);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const car = await Car.findById(id);
    if (!car) {
      res.status(404).json({ error: "Car not found" });
      return;
    }

    res.status(200).json(car);
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

    const car = await Car.findById(id);
    if (!car) {
      res.status(404).json({ error: "Car not found" });
      return;
    }

    const updatedCar = await Car.findByIdAndUpdate(id, payload, {
      new: true,
      useFindAndModify: false,
    });

    res.status(200).json(updatedCar);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const car = await Car.findById(id);
    if (!car) {
      res.status(404).json({ error: "Car not found" });
      return;
    }

    await Car.findByIdAndDelete(id);

    res.sendStatus(204);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.post(
  "/:id/image",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        res
          .status(400)
          .json({ error: "An error occurred. Please try again later." });
        return;
      }

      const payload = req.file as any;

      const updatedCar = await Car.findByIdAndUpdate(
        id,
        { $push: { images: { key: payload.key, imageURL: payload.imageURL } } },
        {
          new: true,
          useFindAndModify: false,
        }
      );

      res.status(200).json(updatedCar);
      return;
    } catch (error) {
      res.sendStatus(500);
      throw new Error(error);
    }
  }
);

router.delete("/:id/image/:key", async (req: Request, res: Response) => {
  try {
    const { id, key } = req.params;

    const car = await Car.findById(id);
    if (!car) {
      res.status(404).json({ error: "Car not found" });
      return;
    }

    const carImages = car.images;
    const image = carImages.find((i) => i.key === key);

    if (image?.key) {
      const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: image.key,
      });

      await s3.send(command);
    }

    const updatedImages = carImages.filter((i) => i.key !== key);

    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { gallery: updatedImages },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json(updatedCar);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

export default router;
