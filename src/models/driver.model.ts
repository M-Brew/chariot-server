import { model, Schema } from "mongoose";

const imageSchema = new Schema({
  imageURL: String,
  key: String,
});

const driverSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    dateOfBirth: String,
    gender: String,
    email: String,
    address: String,
    image: imageSchema,
    phone: String,
    license: imageSchema,
    verified: {
      type: Boolean,
      default: false,
    },
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

const driverModel = model("Driver", driverSchema);

export default driverModel;
