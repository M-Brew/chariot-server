import { model, Schema } from "mongoose";

type StatusType = {
  pending: "pending",
  inProgress: "inProgress",
  completed: "completed",
  cancelled: "cancelled"
}

const rideSchema = new Schema(
  {
    client: Schema.Types.ObjectId,
    driver: Schema.Types.ObjectId,
    car: Schema.Types.ObjectId,
    status: {
      type: String,
      default: "pending",
    },
    startDate: String,
    endDate: String,
    createdBy: Schema.Types.ObjectId,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const rideModel = model("Ride", rideSchema);

export default rideModel;
