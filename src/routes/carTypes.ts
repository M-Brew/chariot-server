import { Router, Request, Response } from "express";
import dotenv from "dotenv";

import CarType from "../models/carType.model";
import { typeValidation } from "../validation/typeValidation";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/s3";
import { upload } from "../middlewares/uploadFile";
import { slugify } from "../utils/slugify";

dotenv.config();

const { S3_BUCKET_NAME } = process.env;

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const { valid, errors } = typeValidation(payload);
    if (!valid) {
      res.status(400).json(errors);
      return;
    }

    const slug = slugify(payload.name);
    const existingCarType = await CarType.findOne({ slug });
    if (existingCarType) {
      res.status(400).json({ error: "Car type with name already exists" });
    }

    const newCarType = new CarType({ ...payload, slug });
    const carType = await newCarType.save();

    res.status(201).json(carType);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const carTypes = await CarType.find();

    res.status(200).json(carTypes);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const carType = await CarType.findById(id);
    if (!carType) {
      res.status(404).json({ error: "Car type not found" });
      return;
    }

    res.status(200).json(carType);
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

    const carType = await CarType.findById(id);
    if (!carType) {
      res.status(404).json({ error: "Car type not found" });
      return;
    }

    const updatedCarType = await CarType.findByIdAndUpdate(id, payload, {
      new: true,
      useFindAndModify: false,
    });

    res.status(200).json(updatedCarType);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const carType = await CarType.findById(id);
    if (!carType) {
      res.status(404).json({ error: "Car type not found" });
      return;
    }

    if (carType.image?.key) {
      const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: carType.image.key,
      });

      await s3.send(command);
    }

    await CarType.findByIdAndDelete(id);

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

      const updatedCarType = await CarType.findByIdAndUpdate(
        id,
        { image: { key: payload.key, imageURL: payload.imageURL } },
        {
          new: true,
          useFindAndModify: false,
        }
      );

      res.status(200).json(updatedCarType);
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

    const carType = await CarType.findById(id);
    if (!carType) {
      res.status(404).json({ error: "Car type not found" });
      return;
    }

    if (carType.image?.key) {
      const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: carType.image.key,
      });

      await s3.send(command);

      const updatedCarType = await CarType.findByIdAndUpdate(
        id,
        { image: null },
        {
          new: true,
          useFindAndModify: false,
        }
      );

      res.status(204).json(updatedCarType);
    }

    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

export default router;
