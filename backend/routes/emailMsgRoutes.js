import express from "express";
import expressAsyncHandler from "express-async-handler";
import EmailMsg from "../models/emailMessaging.js";
import SibApiV3Sdk from "sib-api-v3-sdk";

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

//Fetch All
sendEmailRouter.get(
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
sendEmailRouter.post(
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
sendEmailRouter.delete(
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

// Send News Letter email
sendEmailRouter.post(
  "/send",
  expressAsyncHandler(async (req, res) => {
    const { subject, message } = req.body;

    const facebook = process.env.FACEBOOK_PROFILE_LINK;
    const instagram = process.env.INSTAGRAM_PROFILE_LINK;
    const tiktok = process.env.TIKTOK_PROFILE_LINK;
    const webName = process.env.WEB_NAME;

    // Configure Sendinblue
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;

    try {
      // Retrieve all email addresses from the database
      const allUsers = await EmailMsg.find({});

      // Check if there are subscribers
      if (allUsers.length === 0) {
        return res.status(400).json({ message: "No subscribers found" });
      }

      // Extract email addresses into an array
      const mailList = allUsers.map((user) => user.email);

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

      // Define the BCC recipients separately
      const bccRecipients = mailList.map((email) => ({ email }));

      // Prepare the Sendinblue email payload
      const emailApiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

      // Set sender, subject, content, and BCC recipients
      sendSmtpEmail.sender = {
        email: process.env.EMAIL_ADDRESS,
        name: webName,
      };
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = emailMessageWithUnsubscribe;
      sendSmtpEmail.bcc = bccRecipients; // Add BCC recipients here

      // Send the email
      const sendResponse = await emailApiInstance.sendTransacEmail(
        sendSmtpEmail
      );
      console.log("Email sent successfully:", sendResponse);

      res.send("Mail sent to " + mailList.join(", "));
    } catch (err) {
      console.error("Error sending email:", err);
      res.status(500).json({
        message: "We seem to be experiencing issues. Please try again later.",
      });
    }
  })
);

export default sendEmailRouter;
