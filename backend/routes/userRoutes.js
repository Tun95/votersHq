import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import { generateToken, isAdmin, isAuth } from "../utils.js";
import crypto from "crypto";
import UserActivity from "../models/userActivitiesModels.js";
import {
  RekognitionClient,
  CompareFacesCommand,
} from "@aws-sdk/client-rekognition";
import multer from "multer";
import axios from "axios";
import { SendMailClient } from "zeptomail";

const userRouter = express.Router();

// Set up multer for file uploads (both selfie and ID image)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//====================================
// Route to handle selfie and ID image uploads and verification
//====================================
userRouter.post(
  "/selfie-verification",
  isAuth,
  upload.fields([{ name: "selfieImage" }, { name: "idImage" }]),
  expressAsyncHandler(async (req, res) => {
    // AWS Rekognition setup
    const rekognitionClient = new RekognitionClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    try {
      const { userId } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!req.files || !req.files.selfieImage || !req.files.idImage) {
        return res
          .status(400)
          .json({ message: "Both selfie and ID image are required" });
      }

      // Get the binary data (buffer) of the uploaded images
      const selfieImageBuffer = req.files.selfieImage[0].buffer;
      const idImageBuffer = req.files.idImage[0].buffer;

      const params = {
        SourceImage: { Bytes: idImageBuffer },
        TargetImage: { Bytes: selfieImageBuffer },
        SimilarityThreshold: 80,
      };

      const command = new CompareFacesCommand(params);
      const data = await rekognitionClient.send(command);
      const similarity =
        data.FaceMatches.length > 0 ? data.FaceMatches[0].Similarity : 0;

      if (similarity >= 80) {
        // Save the binary data (buffer) directly to MongoDB
        user.selfieImage = selfieImageBuffer;
        user.idImage = idImageBuffer;
        user.isIdentityVerified = true;
        user.faceMatchSimilarity = similarity;
        await user.save();

        return res
          .status(200)
          .json({ message: "Identity verified successfully", similarity });
      } else {
        return res.status(400).json({
          message: "Face comparison failed. Similarity too low.",
          similarity,
        });
      }
    } catch (err) {
      console.error("Error comparing faces:", err);
      return res.status(500).json({
        message: "Face comparison failed",
        error: {
          message: err.message,
          stack: err.stack,
          code: err.code,
          details: err.$metadata,
        },
      });
    }
  })
);

//============
//ADMIN SIGN IN
//============
userRouter.post(
  "/admin/signin",
  expressAsyncHandler(async (req, res) => {
    const { emailOrPhone, password } = req.body;

    console.log("Admin Login Attempt:", { emailOrPhone, password });

    const admin = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      isAdmin: true, // Ensure that only admins can sign in here
    });

    if (!admin) {
      return res
        .status(401)
        .send({ message: "No admin found with this email/phone" });
    }
    if (admin.isBlocked === true) {
      return res.status(403).send({
        message: "😲 It appears this account has been blocked by Admin",
      });
    }
    if (!admin.isAccountVerified) {
      return res.status(401).send({ message: "Account not verified" });
    }
    if (bcrypt.compareSync(password, admin.password)) {
      console.log("Password Match Successful");
      res.send({
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        image: admin.image,
        email: admin.email,
        phone: admin.phone,
        isAdmin: admin.isAdmin,
        role: admin.role,
        region: admin.region,
        isBlocked: admin.isBlocked,
        isAccountVerified: admin.isAccountVerified,
        token: generateToken(admin),
      });
      return;
    }
    console.log("Password Match Failed");
    res.status(401).send({ message: "Invalid email/phone or password" });
  })
);

//===========
//ADMIN SIGNUP
//===========
userRouter.post(
  "/admin/signup",
  expressAsyncHandler(async (req, res) => {
    const userExists = await User.findOne({ email: req.body?.email });
    if (userExists) {
      throw new Error("User already exists");
    }

    const newAdmin = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      identificationType: req.body.identificationType,
      ninNumber: req.body.ninNumber,
      stateOfOrigin: req.body.stateOfOrigin,
      stateOfResidence: req.body.stateOfResidence,
      region: req.body.region,
      password: bcrypt.hashSync(req.body.password),
      isAdmin: true, // Admins are always marked as admin
      role: req.body.role || "admin", // Set role, defaulting to "admin"
    });

    const admin = await newAdmin.save();
    res.send({
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      image: admin.image,
      email: admin.email,
      phone: admin.phone,
      isAdmin: admin.isAdmin,
      isBlocked: admin.isBlocked,
      region: admin.region,
      isAccountVerified: admin.isAccountVerified,
      role: admin.role, // Include the role in the response
      token: generateToken(admin),
    });
  })
);

//============
//USER SIGN IN
//============
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const { emailOrPhone, password } = req.body;

    console.log("Login Attempt:", { emailOrPhone, password });

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    console.log("User Found:", user);

    if (!user) {
      return res
        .status(401)
        .send({ message: "Invalid email/phone or password" });
    }
    if (user.isBlocked === true) {
      return res.status(403).send({
        message: "😲 It appears this account has been blocked by Admin",
      });
    }
    if (!user.isAccountVerified) {
      return res.status(401).send({ message: "Account not verified" });
    }
    if (bcrypt.compareSync(password, user.password)) {
      console.log("Password Match Successful");
      res.send({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        role: user.role,
        region: user.region,
        isBlocked: user.isBlocked,
        isAccountVerified: user.isAccountVerified,
        token: generateToken(user),
      });
      return;
    }
    console.log("Password Match Failed");
    res.status(401).send({ message: "Invalid email/phone or password" });
  })
);

//===========
//USER SIGNUP
//===========
userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const { email, phone, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    try {
      // Create a new user
      const newUser = new User({
        email,
        phone,
        password: bcrypt.hashSync(password),
        isAdmin: false,
        role: "user",
      });

      const user = await newUser.save();

      // Respond with user details and token
      res.status(201).send({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        region: user.region,
        role: user.role,
        token: generateToken(user),
      });
    } catch (error) {
      console.error(error);

      // Handle other errors
      res.status(500).json({
        message: error.message || "An error occurred while signing up",
        error: error.message || "Unknown error",
      });
    }
  })
);

//===========
// VERIFY NIN AND FETCH USER DATA
//===========
userRouter.post(
  "/verify-nin",
  expressAsyncHandler(async (req, res) => {
    const { ninNumber, dob } = req.body;

    if (!ninNumber || !dob) {
      return res
        .status(400)
        .json({ message: "NIN number and date of birth are required" });
    }

    try {
      // Parse dob from DD/MM/YYYY to ISO format (YYYY-MM-DD)
      const [day, month, year] = dob.split("/");
      const formattedDob = `${year}-${month}-${day}`;

      // Call Dojah's API to verify NIN and fetch user details
      const response = await axios.get(
        `${process.env.DOJAH_BASE_URL}/api/v1/kyc/nin`,
        {
          params: {
            nin: ninNumber,
          },
          headers: {
            Authorization: process.env.DOJAH_PRIVATE_KEY,
            AppId: process.env.DOJAH_APP_ID,
          },
        }
      );

      // Handle response from Dojah
      const { data } = response;
      if (!data || !data.entity || !data.entity.date_of_birth) {
        return res
          .status(400)
          .json({ message: "Verification failed or incomplete data" });
      }

      const { date_of_birth, first_name, last_name, gender, state_of_origin } =
        data.entity;

      // Compare DOB
      if (formattedDob !== date_of_birth) {
        return res.status(400).json({
          message: "Date of birth does not match Dojah records",
        });
      }

      // Format gender
      const formattedGender = gender ? gender.toLowerCase() : null;

      // Respond with verified user details
      res.status(200).json({
        message: "Verification successful",
        userData: {
          ninNumber, // Include the NIN number
          firstName: first_name,
          lastName: last_name,
          gender: formattedGender, // Include formatted gender
          ...(state_of_origin && { state: state_of_origin }),
          dob: date_of_birth,
        },
      });
    } catch (error) {
      console.error(error);

      if (error.response) {
        // Handle Dojah-specific error
        const dojahError =
          error.response.data?.error || "Unknown error from Dojah";
        return res.status(error.response.status || 500).json({
          message: "Error from Dojah",
          details: dojahError,
        });
      }

      // Handle other errors
      res.status(500).json({
        message: "An error occurred during verification",
        error: error.message || "Unknown error",
      });
    }
  })
);

//===========
// KYC SUBMISSION
//===========
userRouter.post(
  "/kyc/:userId", // Dynamic user ID in the URL
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params; // Get the user ID from the URL
    const {
      ninNumber,
      dob,
      gender,
      firstName,
      lastName,
      stateOfOrigin,
      stateOfResidence,
      region,
    } = req.body;

    // Validate required fields
    if (
      !ninNumber ||
      !dob ||
      !gender ||
      !firstName ||
      !lastName ||
      !stateOfOrigin ||
      !stateOfResidence ||
      !region
    ) {
      return res.status(400).json({
        message:
          "All fields (NIN, DOB, first name, last name, state of origin, state of residence, region) are required",
      });
    }

    try {
      // Calculate age from the date of birth (DOB)
      const dobDate = new Date(dob); // Convert DOB to Date object
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();

      // If the birthday hasn't occurred yet this year, subtract one year
      if (
        month < dobDate.getMonth() ||
        (month === dobDate.getMonth() && day < dobDate.getDate())
      ) {
        age--;
      }

      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user with KYC details and calculated age
      user.ninNumber = ninNumber;
      user.dob = dob;
      user.gender = gender;
      user.firstName = firstName;
      user.lastName = lastName;
      user.stateOfOrigin = stateOfOrigin;
      user.stateOfResidence = stateOfResidence;
      user.region = region;
      user.age = age;

      // Save the updated user data
      await user.save();

      // Respond with the updated user data
      res.status(200).json({
        message: "KYC submitted successfully",
        userData: {
          ninNumber,
          firstName,
          lastName,
          stateOfOrigin,
          stateOfResidence,
          region,
          dob,
          gender,
          age,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred during KYC submission",
        error: error.message || "Unknown error",
      });
    }
  })
);

//===================
// ADMIN ADD NEW USER ROUTE
//===================
userRouter.post(
  "/add-user",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const client = new SendMailClient({
      url: "api.zeptomail.com/",
      token: process.env.ZEPTOMAIL_API_KEY,
    });

    // Extract environment variables
    const facebook = process.env.FACEBOOK_PROFILE_LINK;
    const instagram = process.env.INSTAGRAM_PROFILE_LINK;
    const tiktok = process.env.TIKTOK_PROFILE_LINK;

    // Destructure request body
    const {
      firstName,
      lastName,
      email,
      phone,
      identificationType,
      ninNumber,
      age,
      gender,
      stateOfOrigin,
      stateOfResidence,
      region,
      image,
      about,
      education,
      achievement,

      partyImage, // Updated field name
      partyName, // Updated field name
      title, // New field
      contestingFor, // New field
      runningMateName, // New field
      runningMateTitle, // New field
      runningMateImage, // New field
      banner, // New field

      manifesto, // New field

      password,
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with role defaulting to "politician"
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      identificationType,
      ninNumber,
      age,
      gender,
      stateOfOrigin,
      stateOfResidence,
      region,
      image,
      about,
      education,
      achievement,

      role: "politician", // Default role set to "politician"
      partyImage, // Updated field name
      partyName, // Updated field name
      title, // New field
      contestingFor, // New field
      runningMateName, // New field
      runningMateTitle, // New field
      runningMateImage, // New field
      banner, // New field

      manifesto, // New field
      password: hashedPassword,
    });

    // Generate and set OTP for account verification
    const otp = await newUser.createAccountVerificationOtp();

    // Save the user to the database
    const createdUser = await newUser.save();

    // Prepare the email content
    const emailMessage = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { color: #007BFF; }
          p { margin-bottom: 16px; }
          a { text-decoration: none; }
          .anchor {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007BFF;
            color: #FFFFFF !important;
            text-decoration: none;
            border-radius: 4px;
          }
          .footer_info { color: #666; margin: 10px 0; }
          .footer { margin-top: 20px; }
          .social-icons {
            margin-top: 10px;
            display: flex;
            align-items: center;
          }
          .social-icon { margin: 0 5px; font-size: 24px; color: #333; }
          .icons { width: 25px; height: 25px; }
          .instagram { margin-top: 2px; width: 22px; height: 22px; }
          .tik { width: 27px; height: 27px; }
        </style>
      </head>
      <body>
        <h1>Email Verification</h1>
        <p>Hello ${newUser.firstName},</p>
        <p>You have received this email because you have been requested to verify your account.</p>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>Your password is: <strong>${password}</strong></p>
        <p>If you did not request this verification, you can safely ignore this email.</p>
        <p>This verification code is valid for the next 10 minutes.</p>
        <p><a href="${process.env.SUB_DOMAIN}/politician-profile-view/${newUser._id}" class="anchor">Claim Your Account</a></p>
        <p>Thank you,</p>
        <p>${process.env.WEB_NAME} Team</p>
        <hr/>
        <div class="footer">
          <p class="footer_info">For more information, visit our website:</p>
          <p class="footer_info url_link"><a href="${process.env.SUB_DOMAIN}">${process.env.SUB_DOMAIN}</a></p>
          <div class="social-icons">
            <a href="${facebook}" class="social-icon">
              <img class="icons" src="https://res.cloudinary.com/dstj5eqcd/image/upload/v1693399098/facebook_e2bdv6.png" alt="Facebook" />
            </a>
            <a href="${instagram}" class="social-icon">
              <img class="icons instagram" src="https://res.cloudinary.com/dstj5eqcd/image/upload/v1715681997/instagram_iznt7t.png" alt="Instagram" />
            </a>
            <a href="${tiktok}" class="social-icon">
              <img class="icons tik" src="https://res.cloudinary.com/dstj5eqcd/image/upload/v1715681756/tiktok_y8dkwy.png" alt="Tiktok" />
            </a>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      // Send email via ZeptoMail
      await client.sendMail({
        from: {
          address: process.env.EMAIL_ADDRESS,
          name: process.env.WEB_NAME,
        },
        to: [
          {
            email_address: {
              address: email,
              name: createdUser.firstName,
            },
          },
        ],
        subject: "Account Verification",
        htmlbody: emailMessage,
      });

      res.status(201).send({
        message: "User created. Verification email sent.",
        userId: createdUser._id,
      });
    } catch (error) {
      console.error("Failed to send email", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  })
);

//=================================
// Route to handle OTP generation and email verification for user registration and login
//=================================
userRouter.post(
  "/otp-verification",
  expressAsyncHandler(async (req, res) => {
    // Configure Zeptomail
    const client = new SendMailClient({
      url: "api.zeptomail.com/",
      token: process.env.ZEPTOMAIL_API_KEY,
    });

    const facebook = process.env.FACEBOOK_PROFILE_LINK;
    const instagram = process.env.INSTAGRAM_PROFILE_LINK;
    const tiktok = process.env.TIKTOK_PROFILE_LINK;

    try {
      // Get user information from the registration request
      const { email, phone } = req.body;

      // Find the user by email in the database
      const user = await User.findOne({ email });

      // Check if the user exists
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // Generate and save OTP for account verification
      const verificationOtp = await user.createAccountVerificationOtp();
      await user.save();

      // HTML message
      const emailMessage = `
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            h1 {
              color: #007BFF;
            }
            p {
              margin-bottom: 16px;
            }
               a{
                  text-decoration: none;
                  }
            .anchor {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007BFF;
              color: #FFFFFF !important;
              text-decoration: none;
              border-radius: 4px;
            }
              .footer_info {
                  color: #666;
                  margin: 10px 0;
                }
               .footer {
                  margin-top: 20px;
                  
                }
                .social-icons {
                  margin-top: 10px;
                  display: flex;
                  align-items: center;
                }
                .social-icon {
                  margin: 0 5px;
                  font-size: 24px;
                  color: #333;
                }
                .icons{
                  width:25px;
                  height: 25px;
                }
                .instagram{
                  margin-top:2px;
                  width:22px;
                  height: 22px;
                  }
                .tik{
                  width: 27px;
                  height: 27px;
                  }
          </style>
        </head>
        <body>
          <h1>Email Verification</h1>
          <p>Hello,</p>
          <p>You have received this email because you have been requested to verify your account.</p>
          <p>Your verification code is: <strong>${verificationOtp}</strong></p>
          <p>If you did not request this verification, you can safely ignore this email.</p>
          <p>This verification code is valid for the next 10 minutes.</p>
          <p>Thank you,</p>
          <p>${process.env.WEB_NAME} Team</p>
          <hr/>
          <div class="footer">
            <p class="footer_info">For more information, visit our website:</p>
            <p class="footer_info url_link"><a href="${process.env.SUB_DOMAIN}">${process.env.SUB_DOMAIN}</a></p>
            <div class="social-icons">
            <a href=${facebook} class="social-icon">
              <img
                class="icons"
                src="https://res.cloudinary.com/dstj5eqcd/image/upload/v1693399098/facebook_e2bdv6.png"
                alt="Facebook"
              />
            </a>
            <a href=${instagram} class="social-icon">
              <img
                class="icons instagram"
                src="https://res.cloudinary.com/dstj5eqcd/image/upload/v1715681997/instagram_iznt7t.png"
                alt="Instagram"
              />
            </a>
            <a href=${tiktok} class="social-icon">
              <img
                class="icons tik"
                src="https://res.cloudinary.com/dstj5eqcd/image/upload/v1715681756/tiktok_y8dkwy.png"
                alt="Tiktok"
              />
            </a>
          </div>
          </div>
        </body>
        </html>
      `;

      // Send email via ZeptoMail
      await client.sendMail({
        from: {
          address: process.env.EMAIL_ADDRESS,
          name: process.env.WEB_NAME,
        },
        to: [
          {
            email_address: {
              address: user.email,
              name: user.firstName || "User",
            },
          },
        ],
        subject: "Verify your email address",
        htmlbody: emailMessage,
      });

      res.status(200).json({ message: "Verification email sent successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//===============
//OTP Verification
//===============
userRouter.put(
  "/verify-otp",
  expressAsyncHandler(async (req, res) => {
    const { otp } = req?.body;

    try {
      // Find user by OTP and check if the entered OTP matches
      const userFound = await User.findOne({
        accountVerificationOtp: otp,
        accountVerificationOtpExpires: { $gt: new Date() },
      });

      if (!userFound) {
        return res
          .status(400)
          .json({ message: "Invalid OTP or OTP expired. Please try again." });
      }

      // Mark the user as verified and clear OTP-related fields
      userFound.isAccountVerified = true;
      userFound.accountVerificationOtp = undefined;
      userFound.accountVerificationOtpExpires = undefined;
      await userFound.save();

      res.json({
        message: "OTP successfully verified.",
        isAccountVerified: userFound.isAccountVerified,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//==========================
// Fetch all users by latest
//==========================
userRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      // Fetch users and sort by latest using the createdAt field in descending order
      const users = await User.find().sort({ createdAt: -1 });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  })
);

//==========================
// fetch users with role "user"
//==========================
userRouter.get(
  "/role/users",
  expressAsyncHandler(async (req, res) => {
    try {
      const users = await User.find({ role: "user" });
      res.json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching users with role 'user'", error });
    }
  })
);

//==========================
// fetch all users with latest creation date and limit of 10
//==========================
userRouter.get(
  "/latest",
  expressAsyncHandler(async (req, res) => {
    try {
      // Fetch users sorted by creation date in descending order and limit to 10
      const users = await User.find().sort({ createdAt: -1 }).limit(10);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest users", error });
    }
  })
);

//==========================
// fetch users with role "politician"
//==========================
userRouter.get(
  "/role/politicians",
  expressAsyncHandler(async (req, res) => {
    try {
      const users = await User.find({ role: "politician" });
      res.json(users);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching users with role 'politician'",
        error,
      });
    }
  })
);

//===============
// FETCHING USER ACTIVITIES BY USER ID
//===============
userRouter.get(
  "/activities/:userId",
  expressAsyncHandler(async (req, res) => {
    try {
      const activities = await UserActivity.find({ user: req.params.userId })
        .sort({ timestamp: -1 })
        .limit(10);

      if (!activities || activities.length === 0) {
        return res
          .status(404)
          .send({ message: "No activities found for this user" });
      }

      res.send(activities);
    } catch (error) {
      console.error("Error fetching user activities:", error);
      res.status(500).send({ message: "Server Error" });
    }
  })
);

//==========================
// Fetch user by slug
//==========================
userRouter.get(
  "/slug/:slug",
  expressAsyncHandler(async (req, res) => {
    try {
      const { slug } = req.params;
      const user = await User.findOne({ slug });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  })
);

//====================
// USER INFO FETCHING
//====================
userRouter.get(
  "/info/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (user) {
        // Check if the user has a selfieImage or idImage saved in binary format (Buffer)
        let selfieImageBase64 = null;
        let idImageBase64 = null;

        if (user.selfieImage) {
          // Convert binary data (Buffer) to base64
          selfieImageBase64 = user.selfieImage.toString("base64");
        }

        if (user.idImage) {
          // Convert binary data (Buffer) to base64
          idImageBase64 = user.idImage.toString("base64");
        }

        // Send user data along with the base64 encoded images
        res.send({
          ...user._doc, // All other user fields
          selfieImage: selfieImageBase64
            ? `data:image/jpeg;base64,${selfieImageBase64}`
            : null, // Add base64 prefix if image exists
          idImage: idImageBase64
            ? `data:image/jpeg;base64,${idImageBase64}`
            : null, // Add base64 prefix if image exists
        });
      } else {
        res.status(404).send({ message: "User Not Found" });
      }
    } catch (error) {
      res.status(500).send({
        message: "Error Fetching User Information",
        error: error.message,
      });
    }
  })
);

//====================
// PUBLIC USER INFO FETCHING FOR USER ROLE
//====================
userRouter.get(
  "/public-info/user/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.send(user);
    } catch (error) {
      res.status(500).send({
        message: "Error Fetching User Information",
        error: error.message,
      });
    }
  })
);

//====================
// PUBLIC USER INFO FETCHING FOR POLITICIAN ROLE
//====================
userRouter.get(
  "/public-info/politician/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.send(user);
    } catch (error) {
      res.status(500).send({
        message: "Error Fetching User Information",
        error: error.message,
      });
    }
  })
);

//===================
// USER PROFILE UPDATE
//===================
userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;

        user.age = req.body.age || user.age;
        user.gender = req.body.gender || user.gender;

        user.image = req.body.image || user.image;
        user.partyImage = req.body.partyImage || user.partyImage;
        user.partyName = req.body.partyName || user.partyName;
        user.stateOfOrigin = req.body.stateOfOrigin || user.stateOfOrigin;
        user.stateOfResidence =
          req.body.stateOfResidence || user.stateOfResidence;
        user.region = req.body.region || user.region;

        user.about = req.body.about || user.about;
        user.education = req.body.education || user.education;
        user.achievement = req.body.achievement || user.achievement;
        user.ninNumber = req.body.ninNumber || user.ninNumber;

        user.title = req.body.title || user.title; // NEW
        user.contestingFor = req.body.contestingFor || user.contestingFor; // NEW
        user.runningMateName = req.body.runningMateName || user.runningMateName; // NEW
        user.runningMateTitle =
          req.body.runningMateTitle || user.runningMateTitle; // NEW
        user.runningMateImage =
          req.body.runningMateImage || user.runningMateImage; // NEW
        user.banner = req.body.banner || user.banner; // NEW
        user.biography = req.body.biography || user.biography; // NEW
        user.manifesto = req.body.manifesto || user.manifesto; // NEW

        user.emailNotification =
          req.body.emailNotification ?? user.emailNotification;
        user.smsNotification = req.body.smsNotification ?? user.smsNotification;

        user.twoStepVerification =
          req.body.twoStepVerification ?? user.twoStepVerification;

        // Only hash the password if it's different from the current one
        if (req.body.password && req.body.password !== user.password) {
          user.password = bcrypt.hashSync(req.body.password);
        }

        if (req.body.timeline && Array.isArray(req.body.timeline)) {
          user.timeline = req.body.timeline.map((item) => ({
            timelineYear: item.timelineYear,
            timelineTitle: item.timelineTitle,
            timelineDetails: item.timelineDetails,
            user: req.user._id,
          }));
        }

        const updatedUser = await user.save();

        res.send({
          _id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,

          image: updatedUser.image,
          stateOfOrigin: updatedUser.stateOfOrigin,
          stateOfResidence: updatedUser.stateOfResidence,
          region: updatedUser.region,
          about: updatedUser.about,
          education: updatedUser.education,
          achievement: updatedUser.achievement,
          ninNumber: updatedUser.ninNumber,
          title: updatedUser.title, // NEW
          partyImage: updatedUser.partyImage, // NEW
          partyName: updatedUser.partyName, // NEW
          contestingFor: updatedUser.contestingFor, // NEW
          runningMateName: updatedUser.runningMateName, // NEW
          runningMateTitle: updatedUser.runningMateTitle, // NEW
          runningMateImage: updatedUser.runningMateImage, // NEW
          banner: updatedUser.banner, // NEW
          biography: updatedUser.biography, // NEW
          manifesto: updatedUser.manifesto, // NEW

          emailNotification: updatedUser.emailNotification,
          smsNotification: updatedUser.smsNotification,
          twoStepVerification: updatedUser.twoStepVerification,
          isAdmin: updatedUser.isAdmin,
          isBlocked: updatedUser.isBlocked,
          isAccountVerified: updatedUser.isAccountVerified,
          timeline: updatedUser.timeline,
          followers: updatedUser.followers, // Send followers array if needed
          following: updatedUser.following, // Send following array if needed
          token: generateToken(updatedUser),
        });
      } else {
        res.status(404).send({ message: "User Not Found" });
      }
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).send({ message: "Server Error" });
    }
  })
);

//=================
// ADMIN BLOCK USER
//=================
userRouter.put(
  "/block/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.params.id);
    if (user.isAdmin) {
      res.status(400).send({ message: "Cannot Block Admin User" });
    } else {
      try {
        const user = await User.findByIdAndUpdate(
          id,
          {
            isBlocked: true,
          },
          {
            new: true,
            runValidators: true,
          }
        );
        res.send(user);
      } catch {
        res.send({ message: "Fail to block user" });
      }
    }
  })
);

//==================
//ADMIN UNBLOCK USER
//=================
userRouter.put(
  "/unblock/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findByIdAndUpdate(
        id,
        {
          isBlocked: false,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.send(user);
    } catch {
      res.send({ message: "Fail to unblock user" });
    }
  })
);

//==================
// ADMIN USER DELETE
//==================
userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }

    if (user.isAdmin) {
      return res.status(400).send({ message: "Cannot Delete Admin User" });
    }

    try {
      // Use deleteOne to delete the user
      await User.deleteOne({ _id: req.params.id });
      res.send({ message: "User Deleted Successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

//=================
//ADMIN USER UPDATE
//=================
userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      const wasPoliticianRequestPending =
        user.isPoliticianRequest === "pending";

      // Update user fields based on request body
      Object.keys(req.body).forEach((key) => {
        if (key in user) {
          user[key] = req.body[key];
        }
      });

      // If the role is set to "politician", ensure isPoliticianRequest is "approved"
      if (user.role === "politician" && wasPoliticianRequestPending) {
        user.isPoliticianRequest = "approved";

        // Send email notification only if transitioning from "pending" to "approved"
        const client = new SendMailClient({
          url: "api.zeptomail.com/",
          token: process.env.ZEPTOMAIL_API_KEY,
        });

        const emailTemplate = `
          <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
              <h1 style="color: #0078D4;">Congratulations, Politician Upgrade Approved!</h1>
              <p>Dear ${user.firstName || "User"},</p>
              <p>
                We are pleased to inform you that your request to upgrade your account to a politician profile has been approved.
              </p>
              <p>
                You now have access to all politician-specific features on our platform. We encourage you to update your profile 
                and start engaging with your supporters.
              </p>
              <p>
                For any assistance, feel free to contact our support team at 
                <a href="mailto:${process.env.HELLO_EMAIL}">${
          process.env.HELLO_EMAIL
        }</a>.
              </p>
              <br>
              <p>Best regards,</p>
              <p><strong>${process.env.WEB_NAME} Team</strong></p>
            </body>
          </html>
        `;

        try {
          await client.sendMail({
            from: {
              address: process.env.EMAIL_ADDRESS,
              name: process.env.WEB_NAME,
            },
            to: [
              {
                email_address: {
                  address: user.email,
                  name: user.firstName,
                },
              },
            ],
            subject: "Your Politician Upgrade Has Been Approved!",
            htmlbody: emailTemplate,
          });
        } catch (emailError) {
          console.error("Error sending email:", emailError.message);
        }
      }

      // Save the updated user
      const updatedUser = await user.save();
      res.send({
        message: "User Updated Successfully",
        user: updatedUser,
      });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

//==========================
// Upgrade user to politician
//==========================
userRouter.put(
  "/upgrade/:userId",
  expressAsyncHandler(async (req, res) => {
    // Configure Zeptomail
    const client = new SendMailClient({
      url: "api.zeptomail.com/",
      token: process.env.ZEPTOMAIL_API_KEY,
    });

    try {
      const { userId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user's account is verified
      if (!user.isAccountVerified) {
        return res.status(400).json({
          message: "Account not verified. Please verify your account first.",
        });
      }

      // Check if the user is already a politician
      if (user.role === "politician") {
        return res
          .status(400)
          .json({ message: "User is already a politician" });
      }

      // Set isPoliticianRequest to pending
      user.isPoliticianRequest = "pending";
      await user.save();

      const emailTemplate = `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <h1 style="color: #0078D4;">Request Received: Politician Upgrade</h1>
            <p>Dear ${user.firstName || "User"},</p>
            <p>
              We have received your request to upgrade your account to a politician profile. 
              Our team is currently reviewing your request and will notify you once a decision has been made.
            </p>
            <p>
              This process may take up to <strong>48 hours</strong>. If we need any additional information, 
              we will reach out to you via this email address.
            </p>
            <p>
              If you have any urgent inquiries, please do not hesitate to contact our support team at 
              <a href="mailto:${process.env.HELLO_EMAIL}">${
        process.env.HELLO_EMAIL
      }</a>.
            </p>
            <p>Thank you for your patience and interest in becoming a politician on our platform.</p>
            <br>
            <p>Best regards,</p>
            <p><strong>${process.env.WEB_NAME} Team</strong></p>
          </body>
        </html>
      `;

      // Send email via ZeptoMail
      await client.sendMail({
        from: {
          address: process.env.EMAIL_ADDRESS,
          name: process.env.WEB_NAME,
        },
        to: [
          {
            email_address: {
              address: user.email,
              name: user.firstName,
            },
          },
        ],
        subject: "Your Politician Upgrade Request",
        htmlbody: emailTemplate,
      });

      res.status(200).json({
        message:
          "Politician upgrade request submitted. An email has been sent to you.",
        user,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  })
);

//========================
// ADD NEW TIMELINE ENTRY
//========================
userRouter.post(
  "/add-timeline",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).send({ message: "User Not Found" });
      }

      const { timelineYear, timelineTitle, timelineDetails } = req.body;

      if (!timelineYear || !timelineTitle || !timelineDetails) {
        return res.status(400).send({ message: "All fields are required" });
      }

      const newTimeline = {
        timelineYear,
        timelineTitle,
        timelineDetails,
        user: req.user._id,
      };

      user.timeline.push(newTimeline);
      const updatedUser = await user.save();

      res.status(201).send({
        message: "Timeline added successfully",
        timeline: updatedUser.timeline,
      });
    } catch (error) {
      console.error("Error adding timeline:", error);
      res.status(500).send({ message: "Server Error" });
    }
  })
);

//=============
// FOLLOW USER
//=============
userRouter.post(
  "/follow/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userToFollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user._id);

      if (!userToFollow) {
        return res.status(404).send({ message: "User Not Found" });
      }

      if (req.user._id.toString() === req.params.id) {
        return res.status(400).send({ message: "You cannot follow yourself" });
      }

      // Check if the current user is already following the userToFollow
      if (currentUser.following.includes(userToFollow._id)) {
        return res
          .status(400)
          .send({ message: "You are already following this user" });
      }

      // Add the user to the current user's following list
      currentUser.following.push(userToFollow._id);

      // Add the current user to the userToFollow's followers list
      userToFollow.followers.push(currentUser._id);

      await currentUser.save();
      await userToFollow.save();

      // Log the activity
      const activity = new UserActivity({
        user: req.user._id,
        activityType: "Followed a New User",
        activityDetails: `You started following ${userToFollow.firstName} ${userToFollow.lastName}.`,
        relatedId: userToFollow._id,
        relatedModel: "User",
      });
      await activity.save();

      res.status(200).send({ message: "User followed successfully" });
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).send({ message: "Server Error" });
    }
  })
);

//=============
// UNFOLLOW USER
//=============
userRouter.post(
  "/unfollow/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userToUnfollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user._id);

      if (!userToUnfollow) {
        return res.status(404).send({ message: "User Not Found" });
      }

      if (req.user._id.toString() === req.params.id) {
        return res
          .status(400)
          .send({ message: "You cannot unfollow yourself" });
      }

      // Check if the current user is actually following the userToUnfollow
      if (!currentUser.following.includes(userToUnfollow._id)) {
        return res
          .status(400)
          .send({ message: "You are not following this user" });
      }

      // Remove the user from the current user's following list
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userToUnfollow._id.toString()
      );

      // Remove the current user from the userToUnfollow's followers list
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );

      await currentUser.save();
      await userToUnfollow.save();

      // Log the activity
      const activity = new UserActivity({
        user: req.user._id,
        activityType: "Unfollowed a New User",
        activityDetails: `You unfollowed ${userToUnfollow.firstName} ${userToUnfollow.lastName}.`,
        relatedId: userToUnfollow._id,
        relatedModel: "User",
      });
      await activity.save();

      res.status(200).send({ message: "User unfollowed successfully" });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      res.status(500).send({ message: "Server Error" });
    }
  })
);

//================
// PASSWORD UPDATE
//================
userRouter.put(
  "/update-password",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        const { currentPassword, newPassword } = req.body;

        // Check if the current password matches
        if (!(await bcrypt.compare(currentPassword, user.password))) {
          return res
            .status(401)
            .send({ message: "Current password is incorrect" });
        }

        // Hash and update the new password
        user.password = bcrypt.hashSync(newPassword);
        await user.save();

        res.send({ message: "Password updated successfully" });
      } else {
        res.status(404).send({ message: "User Not Found" });
      }
    } catch (error) {
      console.error("Password Update Error:", error);
      res.status(500).send({ message: "Server Error" });
    }
  })
);

//================
// NOTIFICATION UPDATE
//================
userRouter.put(
  "/update-notifications/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (user) {
        // Update email and SMS notification settings
        if (typeof req.body.emailNotification === "boolean") {
          user.emailNotification = req.body.emailNotification;
        }
        if (typeof req.body.smsNotification === "boolean") {
          user.smsNotification = req.body.smsNotification;
        }

        const updatedUser = await user.save();

        res.send({
          _id: updatedUser._id,
          emailNotification: updatedUser.emailNotification,
          smsNotification: updatedUser.smsNotification,
        });
      } else {
        res.status(404).send({ message: "User Not Found" });
      }
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).send({ message: "Server Error" });
    }
  })
);

//===============
//Password Reset Token
//===============
userRouter.post(
  "/password-token",
  expressAsyncHandler(async (req, res) => {
    const client = new SendMailClient({
      url: "api.zeptomail.com/",
      token: process.env.ZEPTOMAIL_API_KEY,
    });

    const facebook = process.env.FACEBOOK_PROFILE_LINK;
    const instagram = process.env.INSTAGRAM_PROFILE_LINK;
    const tiktok = process.env.TIKTOK_PROFILE_LINK;

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    try {
      const token = await user.createPasswordResetToken();

      // Generate HTML message
      const resetURL = `
      <html>
        <head>
          <style>
            .footer_info {
              color: #666;
              margin: 10px 0;
            }

            .footer {
              margin-top: 20px;
            }
            .social-icons {
              margin-top: 10px;
              display: flex;
              align-items: center;
            }
            .social-icon {
              margin: 0 5px;
              font-size: 24px;
              color: #333;
              text-decoration: none;
            }
            .icons {
              width: 25px;
              height: 25px;
            }
            .instagram {
              margin-top: 2px;
              width: 22px;
              height: 22px;
            }
            .tik {
              width: 27px;
              height: 27px;
            }
          </style>
        </head>
        <body>
          <p>Hello ${user.firstName},</p>
          <p>We received a request to reset your password for your account at ${process.env.WEB_NAME}. If you did not request this, please ignore this email.</p>
          <p>To reset your password, click the button below:</p>
          <a href="${process.env.SUB_DOMAIN}/${user.id}/new-password/${token}" style="display: inline-block; margin: 10px 0; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px;">Reset Password</a>
          <p style="color: #777; font-size: 14px;">Please note that this link will expire in 10 minutes for security reasons.</p>
          <p>If the button above doesn't work, you can also copy and paste the following URL into your web browser:</p>
          <p>${process.env.SUB_DOMAIN}/${user.id}/new-password/${token}</p>
          <p>If you have any questions or need further assistance, please contact our support team at ${process.env.EMAIL_ADDRESS}.</p>
          <p>Best regards,<br/>${process.env.WEB_NAME} Team</p>
          <hr />
          <div class="footer">
            <p class="footer_info">For more information, visit our website:</p>
            <p class="footer_info url_link"><a href="${process.env.SUB_DOMAIN}">${process.env.SUB_DOMAIN}</a></p>
            <div class="social-icons">
              <a href="${facebook}" class="social-icon">
                <img class="icons" src="https://res.cloudinary.com/dstj5eqcd/image/upload/v1693399098/facebook_e2bdv6.png" alt="Facebook" />
              </a>
              <a href="${instagram}" class="social-icon">
                <img class="icons instagram" src="https://res.cloudinary.com/dstj5eqcd/image/upload/v1715681997/instagram_iznt7t.png" alt="Instagram" />
              </a>
              <a href="${tiktok}" class="social-icon">
                <img class="icons tik" src="https://res.cloudinary.com/dstj5eqcd/image/upload/v1715681756/tiktok_y8dkwy.png" alt="Tiktok" />
              </a>
            </div>
          </div>
        </body>
      </html>`;

      await client.sendMail({
        from: {
          address: process.env.EMAIL_ADDRESS,
          name: process.env.WEB_NAME,
        },
        to: [
          {
            email_address: {
              address: user.email,
              name: user.firstName,
            },
          },
        ],
        subject: "Reset Password",
        htmlbody: resetURL,
      });

      await user.save();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

//===============
//Password Reset
//===============
userRouter.put(
  "/:id/reset-password",
  expressAsyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Log token details for debugging
    console.log("Received Token:", token);
    console.log("Hashed Token:", hashedToken);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      console.log("Invalid token or token expired");
      return res
        .status(400)
        .json({ message: "Invalid token or token expired, try again" });
    }

    // Check if the new password is the same as the old password
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    // Update user password
    user.password = bcrypt.hashSync(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  })
);

export default userRouter;
