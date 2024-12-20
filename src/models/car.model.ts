import { model, Schema } from "mongoose";

const imageSchema = new Schema({
  imageURL: String,
  key: String,
});

const carSchema = new Schema(
  {
    name: String,
    type: String,
    brand: String,
    registrationNumber: String,
    capacity: Number,
    images: [imageSchema],
    driver: Schema.Types.ObjectId,
    status: {
      type: String,
      default: "inactive",
    },
    createdBy: Schema.Types.ObjectId,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const carModel = model("Car", carSchema);

export default carModel;
