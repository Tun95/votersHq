import express from "express";
import multer from "multer"; // Middleware for handling multipart/form-data (file upload)
import fs from "fs"; // Node.js file system module
import path from "path";
import expressAsyncHandler from "express-async-handler";
import EmailMsg from "../models/emailMessaging.js";
import nodemailer from "nodemailer";

const sendEmailRouter = express.Router();

//=========================
// Subscribe to News Letter
//=========================
sendEmailRouter.post(
  "/subscribe",
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const emailExist = await EmailMsg.findOne({ email: req.body.email });

      if (emailExist) {
        return res.status(400).send({ message: "Email already exists" });
      }

      const subscribe = await EmailMsg.create({
        email: req.body.email,
      });

      res.status(200).send({
        message: "You have successfully subscribed to our newsletter",
      });
      console.log(subscribe);
    } catch (error) {
      console.error("Error during subscription:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

export default sendEmailRouter;
