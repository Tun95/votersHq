import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    image: { type: String },
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

const billsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String },
    image: { type: String },
    banner: { type: String },
    description: { type: String },
    sortType: [String],
    sortStatus: [String],
    sortCategory: [String],
    sortState: [String],
    views: { type: Number, default: 0 },
    comments: [commentSchema],
    yeaVotes: [
      {
        voterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        region: { type: String }, // Add region here
        createdAt: { type: Date, default: Date.now },
      },
    ],
    nayVotes: [
      {
        voterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        region: { type: String }, // Add region here
        createdAt: { type: Date, default: Date.now },
      },
    ],
    expirationDate: Date,
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
billsSchema.pre("save", async function (next) {
  if (this.isModified("title") || !this.slug) {
    let title = this.title || "Default Title"; // Use a default title if it's missing or undefined
    let baseSlug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    // Check for duplicate slugs
    const existingBills = await this.constructor.findOne({
      slug: baseSlug,
    });

    if (existingBills) {
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

const Bills = mongoose.model("Bills", billsSchema);
export default Bills;
