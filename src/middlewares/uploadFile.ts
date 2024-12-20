import multerS3 from "multer-s3";
import multer from "multer";
import dotenv from "dotenv";
import crypto from "crypto";

import { s3 } from "../utils/s3";
const { S3_BUCKET_NAME } = process.env;

dotenv.config();

const generateImageName = (mimetype: string) =>
  `${crypto.randomBytes(32).toString("hex")}.${mimetype.split("/")[1]}`;

const upload = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = generateImageName(file.mimetype);
      cb(null, fileName);
    },
  }),
});

export { upload };
