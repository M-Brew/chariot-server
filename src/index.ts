import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import carTypeRoutes from "./routes/carTypes";
import clientTypeRoutes from "./routes/clientTypes";
import driverTypeRoutes from "./routes/driverTypes";
import rideTypeRoutes from "./routes/rideTypes";

import authRoutes from "./routes/auth";
import driverRoutes from "./routes/drivers";
import carRoutes from "./routes/cars";
import clientRoutes from "./routes/clients";
import rideRoutes from "./routes/rides";

const { PORT, DB_URI } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

// types
app.use("/api/car-types", carTypeRoutes);
app.use("/api/client-types", clientTypeRoutes);
app.use("/api/driver-types", driverTypeRoutes);
app.use("/api/ride-types", rideTypeRoutes);

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
