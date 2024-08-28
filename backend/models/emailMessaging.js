import mongoose from "mongoose";

const emailMsgSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const EmailMsg = mongoose.model("EmailMsg", emailMsgSchema);

export default EmailMsg;
