import { Router, Request, Response } from "express";
import dotenv from "dotenv";

import Driver from "../models/driver.model";
import { driverValidation } from "../validation/driverValidation";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/s3";
import { upload } from "../middlewares/uploadFile";

dotenv.config();

const { S3_BUCKET_NAME } = process.env;

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const { valid, errors } = driverValidation(payload);
    if (!valid) {
      res.status(400).json(errors);
      return;
    }

    const newDriver = new Driver(payload);
    const driver = await newDriver.save();

    res.status(201).json(driver);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const drivers = await Driver.find();

    res.status(200).json(drivers);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findById(id);
    if (!driver) {
      res.status(404).json({ error: "Driver not found" });
      return;
    }

    res.status(200).json(driver);
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

    const driver = await Driver.findById(id);
    if (!driver) {
      res.status(404).json({ error: "Driver not found" });
      return;
    }

    const updatedDriver = await Driver.findByIdAndUpdate(id, payload, {
      new: true,
      useFindAndModify: false,
    });

    res.status(200).json(updatedDriver);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findById(id);
    if (!driver) {
      res.status(404).json({ error: "Driver not found" });
      return;
    }

    await Driver.findByIdAndDelete(id);

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

      const updatedDriver = await Driver.findByIdAndUpdate(
        id,
        { image: { key: payload.key, imageURL: payload.imageURL } },
        {
          new: true,
          useFindAndModify: false,
        }
      );

      res.status(200).json(updatedDriver);
      return;
    } catch (error) {
      res.sendStatus(500);
      throw new Error(error);
    }
  }
);

router.post(
  "/:id/license",
  upload.single("license"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        res
          .status(400)
          .json({ error: "An error occurred. Please try again later." });
        return;
      }

      const payload = req.body;

      const updatedDriver = await Driver.findByIdAndUpdate(
        id,
        { license: { key: payload.key, imageURL: payload.imageURL } },
        {
          new: true,
          useFindAndModify: false,
        }
      );

      res.status(200).json(updatedDriver);
      return;
    } catch (error) {
      res.sendStatus(500);
      throw new Error(error);
    }
  }
);

router.delete("/:id/image", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findById(id);
    if (!driver) {
      res.status(404).json({ error: "Driver not found" });
      return;
    }

    if (driver.image.key) {
      const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: driver.image.key,
      });

      await s3.send(command);
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      { image: null },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json(updatedDriver);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id/license", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findById(id);
    if (!driver) {
      res.status(404).json({ error: "Driver not found" });
      return;
    }

    if (driver.image.key) {
      const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: driver.license.key,
      });

      await s3.send(command);
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      { license: null },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json(updatedDriver);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

export default router;
