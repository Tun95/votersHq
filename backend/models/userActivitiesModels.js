import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    activityType: {
      type: String,
      enum: [
        "Commented on a Bill",
        "Commented on an Election",
        "Voted in an Election",
        "Voted on a Bill",
        "Followed a New User",
        "Unfollowed a New User",
      ],
      required: true,
    },
    activityDetails: {
      type: String, // A brief description of the activity
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel", // Dynamically reference either Bill, Election, or User
    },
    relatedModel: {
      type: String,
      enum: ["Bill", "Election", "User"], // Specify the possible models
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const UserActivity = mongoose.model("UserActivity", userActivitySchema);
export default UserActivity;
