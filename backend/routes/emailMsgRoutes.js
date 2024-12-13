import express from "express";
import expressAsyncHandler from "express-async-handler";
import EmailMsg from "../models/emailMessaging.js";
import User from "../models/userModels.js";
import axios from "axios";
import { SendMailClient } from "zeptomail";

const sendEmailSmsRouter = express.Router();

//=========================
// Subscribe to News Letter
//=========================
sendEmailSmsRouter.post(
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

//Fetch All
sendEmailSmsRouter.get(
  "/",
  // isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const subscribers = await EmailMsg.find({}).sort("-createdAt");
      res.send(subscribers);
    } catch (error) {
      res.send(error);
    }
  })
);

// Unsubscribe from News Letter
sendEmailSmsRouter.post(
  "/unsubscribe",
  expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    const unsubscribedUser = await EmailMsg.findOneAndDelete({ email });
    if (unsubscribedUser) {
      return res
        .status(200)
        .send({ message: "You have successfully unsubscribed" });
    } else {
      return res
        .status(404)
        .send({ message: "Email not found or already unsubscribed" });
    }
  })
);

//=======
//Delete
//=======
sendEmailSmsRouter.delete(
  "/:id",
  // isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const subscriber = await EmailMsg.findById(req.params.id);

      if (subscriber) {
        await EmailMsg.deleteOne({ _id: req.params.id });
        res.send({ message: "Subscriber Deleted Successfully" });
      } else {
        res.status(404).send({ message: "Subscriber Not Found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

// Send News Letter email to subscribers
sendEmailSmsRouter.post(
  "/send",
  expressAsyncHandler(async (req, res) => {
    const { subject, message } = req.body;

    const client = new SendMailClient({
      url: "api.zeptomail.com/",
      token: process.env.ZEPTOMAIL_API_KEY,
    });

    const facebook = process.env.FACEBOOK_PROFILE_LINK;
    const instagram = process.env.INSTAGRAM_PROFILE_LINK;
    const tiktok = process.env.TIKTOK_PROFILE_LINK;
    const webName = process.env.WEB_NAME;

    try {
      // Retrieve all email addresses from the database
      const allUsers = await EmailMsg.find({});

      // Check if there are subscribers
      if (allUsers.length === 0) {
        return res.status(400).json({ message: "No subscribers found" });
      }

      // Map users to ZeptoMail `to` array format
      const toRecipients = allUsers.map((user) => ({
        email_address: {
          address: user.email,
          name: "Subscriber",
        },
        merge_info: {
          name: "Subscriber",
        },
      }));

      // Create the email template with unsubscribe and social links
      const emailMessageWithUnsubscribe = `
        <html>
         <head>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            p {
              margin-bottom: 16px;
            }
            .anchor {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007BFF;
              color: #FFFFFF !important;
              text-decoration: none;
              border-radius: 4px;
            }
            .footer {
              margin-top: 20px;
            }
            .footer_info {
              color: #666;
              margin: 10px 0;
            }
            a {
              text-decoration: none;
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
              width: 26px;
              height: 26px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              ${message}
            </div>
            <hr/>
            <div class="footer">
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

      // Send email using ZeptoMail
      await client.sendBatchMail({
        from: {
          address: process.env.EMAIL_ADDRESS,
          name: webName,
        },
        to: toRecipients,
        subject: subject,
        htmlbody: emailMessageWithUnsubscribe,
        track_clicks: true,
        track_opens: true,
      });

      res.send("Mail sent to " + toRecipients.join(", "));
    } catch (err) {
      console.error("Error sending email:", err);
      res.status(500).json({
        message: "We seem to be experiencing issues. Please try again later.",
      });
    }
  })
);

// Send SMS to Users with smsNotification enabled
sendEmailSmsRouter.post(
  "/send-sms",
  expressAsyncHandler(async (req, res) => {
    const termiiApiKey = process.env.TERMII_API;
    const termiiBaseUrl =
      process.env.TERMII_BASE_URL || "https://v3.api.termii.com";

    try {
      // Fetch all users with smsNotification enabled
      const users = await User.find({
        smsNotification: true,
        phone: { $exists: true, $ne: null },
      });

      if (!users.length) {
        console.log("No users found with SMS notifications enabled.");
        return res
          .status(404)
          .json({ message: "No users with SMS notifications enabled." });
      }

      console.log(`Found ${users.length} users to send SMS to.`);

      // Prepare the message
      const message =
        "This is a test message. Stay informed about the latest updates!";

      // Track whether any SMS was successfully sent
      let smsSent = false;

      // Iterate through users and send SMS
      for (const user of users) {
        let phone = user.phone;

        // Convert local Nigerian numbers to international format
        if (/^0\d{10}$/.test(phone)) {
          phone = phone.replace(/^0/, "234");
        }

        // Ensure phone number starts with '234' and has 13 digits, then add '+' in front
        if (/^234\d{10}$/.test(phone)) {
          phone = `+${phone}`; // Add the '+' prefix to the number
          console.log(`Sending SMS to ${phone}...`);

          // Send the SMS via Termii API
          const data = {
            sender_id: "votersHq",
            to: phone,
            from: "votersHq", // Your sender ID or business name
            sms: message,
            type: "plain", // Standard SMS
            channel: "generic", // The SMS channel type
            api_key: termiiApiKey, // Add the API key here
          };

          try {
            const response = await axios.post(
              `${termiiBaseUrl}/api/sms/send/bulk`,
              data,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            console.log(`SMS sent to ${phone}:`, response.data);
            smsSent = true; // Set flag to true if at least one SMS was sent
          } catch (error) {
            console.error(
              `Failed to send SMS to ${phone}:`,
              error.response ? error.response.data : error.message
            );
          }
        } else {
          console.log(`Invalid phone format: ${phone}`);
        }
      }

      // If at least one SMS was sent, return success
      if (smsSent) {
        res.status(200).json({ message: "SMS successfully sent to users." });
      } else {
        res
          .status(400)
          .json({ message: "No valid phone numbers to send SMS." });
      }
    } catch (error) {
      console.error("Error sending SMS: ", error.message);
      res.status(500).json({ message: "Error sending SMS" });
    }
  })
);

//==============
// Send Email to Users with emailNotification enabled
//==============
sendEmailSmsRouter.post(
  "/send-email",
  expressAsyncHandler(async (req, res) => {
    const { subject, message } = req.body;

    const client = new SendMailClient({
      url: "api.zeptomail.com/",
      token: process.env.ZEPTOMAIL_API_KEY,
    });

    const facebook = process.env.FACEBOOK_PROFILE_LINK;
    const instagram = process.env.INSTAGRAM_PROFILE_LINK;
    const tiktok = process.env.TIKTOK_PROFILE_LINK;
    const webName = process.env.WEB_NAME;

    try {
      // Retrieve all users with emailNotification enabled
      const usersWithEmailNotification = await User.find({
        emailNotification: true,
      });

      // Check if there are users with email notifications enabled
      if (usersWithEmailNotification.length === 0) {
        return res
          .status(400)
          .json({ message: "No users with email notifications enabled." });
      }

      // Map users to ZeptoMail `to` array format
      const toRecipients = usersWithEmailNotification.map((user) => ({
        email_address: {
          address: user.email,
          name: user.firstName || "User",
        },
        merge_info: {
          name: user.firstName || "User",
        },
      }));

      // Create the email template with unsubscribe and social links
      const emailMessageWithUnsubscribe = `
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            p {
              margin-bottom: 16px;
            }
            .anchor {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007BFF;
              color: #FFFFFF !important;
              text-decoration: none;
              border-radius: 4px;
            }
            .footer {
              margin-top: 20px;
            }
            .footer_info {
              color: #666;
              margin: 10px 0;
            }
            a {
              text-decoration: none;
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
              width: 26px;
              height: 26px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              ${message}
            </div>
            <hr/>
            <div class="footer">
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
          </div>
        </body>
        </html>
      `;

      // Send email using ZeptoMail
      await client.sendBatchMail({
        from: {
          address: process.env.EMAIL_ADDRESS,
          name: webName,
        },
        to: toRecipients,
        subject: subject,
        htmlbody: emailMessageWithUnsubscribe,
        track_clicks: true,
        track_opens: true,
      });

      res.send("Mail sent to " + toRecipients.join(", "));
    } catch (err) {
      console.error("Error sending email:", err);
      res.status(500).json({
        message: "We seem to be experiencing issues. Please try again later.",
      });
    }
  })
);

//==============
// Contact Admin
//==============
sendEmailSmsRouter.post(
  "/contact",
  expressAsyncHandler(async (req, res) => {
    const client = new SendMailClient({
      url: "api.zeptomail.com/",
      token: process.env.ZEPTOMAIL_API_KEY,
    });

    const { email, name, message } = req.body;

    try {
      // Construct the email content
      const emailMessage = `
        <html>
        <body>
          <h2>New Contact Us Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </body>
        </html>
      `;

      // Send email using ZeptoMail
      await client.sendMail({
        from: {
          address: process.env.CONTACT_EMAIL,
          name: "Contact",
        },
        to: [
          {
            email_address: {
              address: process.env.HELLO_EMAIL,
              name: "VotersHq",
            },
          },
        ],
        subject: "Contact Us - New Message",
        htmlbody: emailMessage,
      });

      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Email sending error:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  })
);

export default sendEmailSmsRouter;
