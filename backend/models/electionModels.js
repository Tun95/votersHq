import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    image: { type: String },
    role: { type: String },
    replyContent: { type: String },
    mentionedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const commentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    image: { type: String },
    role: { type: String },
    commentContent: { type: String },
    replies: [replySchema], // Array of replies
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const electionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String },
    image: { type: String },
    banner: { type: String },
    pollOverview: { type: String },
    featured: { type: Boolean, default: false },
    location: { type: String },
    candidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    sortType: [String],
    sortStatus: [String],
    sortCategory: [String],
    status: {
      type: String,
      enum: ["ongoing", "upcoming", "concluded"],
      required: true,
    },
    views: { type: Number, default: 0 },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    votes: [
      {
        voterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        age: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    comments: [commentSchema],

    expirationDate: Date,
    startDate: Date,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
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

// Pre-save middleware to generate slug from title
electionSchema.pre("save", async function (next) {
  if (this.isModified("title") || !this.slug) {
    let title = this.title || "Default Title"; // Use a default title if it's missing or undefined
    let baseSlug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    // Check for duplicate slugs
    const existingElection = await this.constructor.findOne({
      slug: baseSlug,
    });

    if (existingElection) {
      let counter = 1;
      while (
        await this.constructor.findOne({
          slug: `${baseSlug}-${counter}`,
        })
      ) {
        counter++;
      }
      this.slug = `${baseSlug}-${counter}`;
    } else {
      this.slug = baseSlug;
    }
  }
  next();
});

const Election = mongoose.model("Election", electionSchema);
export default Election;
