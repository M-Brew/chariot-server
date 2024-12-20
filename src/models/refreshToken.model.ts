import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    // expireAt: {
    //   type: Date,
    //   default: Date.now,
    //   index: { expires: '5m' },
    // },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const refreshTokenModel = model("RefreshToken", refreshTokenSchema);

export default refreshTokenModel;
