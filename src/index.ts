import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth";
import driverRoutes from "./routes/drivers";
import carRoutes from "./routes/cars";
import clientRoutes from "./routes/clients";
import rideRoutes from "./routes/rides";

const { PORT, DB_URI } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/rides", rideRoutes);

mongoose.connect(DB_URI);
mongoose.connection.on("open", () =>
  console.log("Connected to database successfully")
);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
