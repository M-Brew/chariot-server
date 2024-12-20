import { Router, Request, Response } from "express";
import dotenv from "dotenv";

import Client from "../models/client.model";
import { clientValidation } from "../validation/clientValidation";

dotenv.config();

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const { valid, errors } = clientValidation(payload);
    if (!valid) {
      res.status(400).json(errors);
      return;
    }

    const existingEmail = await Client.findOne({ email: payload.email });
    if (existingEmail) {
      res.status(400).json({ error: "Client with email exists" });
      return;
    }

    const newClient = new Client(payload);
    const client = await newClient.save();

    res.status(201).json(client);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const clients = await Client.find();

    res.status(200).json(clients);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);
    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    res.status(200).json(client);
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

    const client = await Client.findById(id);
    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    const updatedClient = await Client.findByIdAndUpdate(id, payload, {
      new: true,
      useFindAndModify: false,
    });

    res.status(200).json(updatedClient);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);
    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    await Client.findByIdAndDelete(id);

    res.sendStatus(204);
    return;
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

export default router;
