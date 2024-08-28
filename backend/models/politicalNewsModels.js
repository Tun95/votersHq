import mongoose from "mongoose";

const politicalNewsSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
    },
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

// Create the slug before saving the political news article
politicalNewsSchema.pre("save", async function (next) {
  if (this.isModified("title") || !this.slug) {
    let title = this.title || "Default Title";
    let baseSlug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    // Check for duplicate slugs
    const existingArticle = await this.constructor.findOne({ slug: baseSlug });

    if (existingArticle) {
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

const PoliticalNews = mongoose.model("PoliticalNews", politicalNewsSchema);

export default PoliticalNews;
