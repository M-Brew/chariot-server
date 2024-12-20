import { model, Schema } from "mongoose";

const clientSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    createdBy: Schema.Types.ObjectId,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const clientModel = model("Client", clientSchema);

export default clientModel;
