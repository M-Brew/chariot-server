import { model, Schema } from "mongoose";

const imageSchema = new Schema({
  imageURL: String,
  key: String,
});

const rideTypeSchema = new Schema(
  {
    name: String,
    slug: String,
    description: String,
    count: {
      type: Number,
      default: 0,
    },
    image: imageSchema,
    createdBy: Schema.Types.ObjectId,
    lastUpdatedBy: Schema.Types.ObjectId,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const rideTypeModel = model("RideType", rideTypeSchema);

export default rideTypeModel;
