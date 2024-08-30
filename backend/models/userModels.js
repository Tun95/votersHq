import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const politicalTimeline = new mongoose.Schema(
  {
    timelineYear: { type: Number, required: true },
    timelineTitle: { type: String, required: true },
    timelineDetails: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    slug: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    identificationType: { type: String },
    ninNumber: { type: Number },
    age: { type: Number },
    gender: { type: String },
    stateOfOrigin: { type: String },
    stateOfResidence: { type: String },
    region: { type: String },
    image: { type: String },
    about: { type: String },
    education: { type: String },
    achievement: { type: String },
    role: { type: String, enum: ["user", "politician"], default: "user" },

    title: { type: String }, //NEW
    partyImage: { type: String }, //NEW
    partyName: { type: String }, //NEW
    contestingFor: { type: String }, //NEW
    runningMateName: { type: String }, //NEW
    runningMateTitle: { type: String }, //NEW
    runningMateImage: { type: String }, //NEW
    banner: { type: String }, //NEW
    biography: { type: String }, //NEW
    manifesto: { type: String }, //NEW

    twoStepVerification: { type: Boolean, default: false },
    emailNotification: { type: Boolean, default: false },
    smsNotification: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false, required: true },
    password: { type: String, required: true },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isAccountVerified: { type: Boolean, default: false },
    accountVerificationOtp: { type: String },
    accountVerificationOtpExpires: { type: Date },

    timeline: [politicalTimeline],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Followers array
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Following array
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

// Create the slug before saving the user
userSchema.pre("save", async function (next) {
  if (
    this.isModified("firstName") ||
    this.isModified("lastName") ||
    !this.slug
  ) {
    let fullName = `${this.firstName} ${this.lastName}`;
    let baseSlug = fullName
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    // Check for duplicate slugs
    const existingUser = await this.constructor.findOne({ slug: baseSlug });

    if (existingUser) {
      let counter = 1;
      while (
        await this.constructor.findOne({ slug: `${baseSlug}-${counter}` })
      ) {
        counter++;
      }
      this.set("slug", `${baseSlug}-${counter}`);
    } else {
      this.set("slug", baseSlug);
    }
  }
  next();
});

//Verify Account
userSchema.methods.createAccountVerificationOtp = async function () {
  // Generate a random 6-digit verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Set the verification code and expiration time
  this.accountVerificationOtp = verificationCode;
  this.accountVerificationOtpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

  return verificationCode;
};

//Password Reset
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10mins
  return resetToken;
};

//Match Password
userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
