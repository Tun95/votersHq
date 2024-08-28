import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { isAuth } from "../utils.js";
import sharp from "sharp";

const upload = multer();

const uploadRouter = express.Router();

uploadRouter.post("/", isAuth, upload.single("file"), async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Check file type
  const fileTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (!fileTypes.includes(req.file.mimetype)) {
    return res.status(400).send({
      message: "Invalid file type. Only PNG, JPG, and JPEG are allowed.",
    });
  }

  try {
    const image = sharp(req.file.buffer);
    const metadata = await image.metadata();

    let compressedBuffer;

    if (metadata.width > 1000) {
      compressedBuffer = await image
        .resize({ width: 1000 }) // Resize to a max width of 1000px
        .webp({ quality: 80 }) // Compress and convert to WebP with a quality of 80%
        .toBuffer();
    } else {
      compressedBuffer = await image
        .webp({ quality: 80 }) // Compress and convert to WebP with a quality of 80%
        .toBuffer();
    }

    // Ensure the compressed image is under 500kb
    if (compressedBuffer.length > 500 * 1024) {
      return res.status(400).send({
        message: "Image is too large. Please upload an image under 500kb.",
      });
    }

    // Upload to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image", format: "webp" },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };
    const result = await streamUpload(compressedBuffer);

    // Optionally, apply transformations to serve optimized images
    const optimizedUrl = cloudinary.url(result.public_id, {
      transformation: [
        { width: "auto", dpr: "auto", crop: "scale" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    res.set("Cache-Control", "public, max-age=86400"); // Cache for 1 day
    res.send({ ...result, optimizedUrl });
  } catch (error) {
    res.status(500).send({ message: "Upload failed", error: error.message });
  }
});

export default uploadRouter;
