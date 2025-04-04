import { Router, Request, Response } from "express";
import dotenv from "dotenv";

import DriverType from "../models/driverType.model";
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
    const existingDriverType = await DriverType.findOne({ slug });
    if (existingDriverType) {
      res.status(400).json({ error: "Driver type with name already exists" });
    }

    const newDriverType = new DriverType(payload);
    const driverType = await newDriverType.save();

    res.status(201).json(driverType);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const driverTypes = await DriverType.find();

    res.status(200).json(driverTypes);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const driverType = await DriverType.findById(id);
    if (!driverType) {
      res.status(404).json({ error: "Driver type not found" });
      return;
    }

    res.status(200).json(driverType);
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

    const driverType = await DriverType.findById(id);
    if (!driverType) {
      res.status(404).json({ error: "Driver type not found" });
      return;
    }

    const updatedDriverType = await DriverType.findByIdAndUpdate(id, payload, {
      new: true,
      useFindAndModify: false,
    });

    res.status(200).json(updatedDriverType);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const driverType = await DriverType.findById(id);
    if (!driverType) {
      res.status(404).json({ error: "Driver type not found" });
      return;
    }

    if (driverType.image?.key) {
      const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: driverType.image.key,
      });

      await s3.send(command);
    }

    await DriverType.findByIdAndDelete(id);

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

      const updatedDriverType = await DriverType.findByIdAndUpdate(
        id,
        { image: { key: payload.key, imageURL: payload.imageURL } },
        {
          new: true,
          useFindAndModify: false,
        }
      );

      res.status(200).json(updatedDriverType);
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

    const driverType = await DriverType.findById(id);
    if (!driverType) {
      res.status(404).json({ error: "Driver type not found" });
      return;
    }

    if (driverType.image?.key) {
      const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: driverType.image.key,
      });

      await s3.send(command);

      const updatedDriverType = await DriverType.findByIdAndUpdate(
        id,
        { image: null },
        {
          new: true,
          useFindAndModify: false,
        }
      );

      res.status(204).json(updatedDriverType);
    }

    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

export default router;
