import express from "express";
import { isAuth, isAdmin } from "../utils.js";
import PoliticalNews from "../models/politicalNewsModels.js";

const politicalNewsRouter = express.Router();

//=====================================
// Create a new political news article
//=====================================
politicalNewsRouter.post("/", isAuth, isAdmin, async (req, res) => {
  try {
    const { title, image, description } = req.body;
    const politicalNews = new PoliticalNews({
      title,
      image,
      description,
      user: req.user._id,
    });
    const createdNews = await politicalNews.save();
    res
      .status(201)
      .send({ message: "Political News Created", news: createdNews });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//=====================================
// Fetch all political news articles (latest first)
//=====================================
politicalNewsRouter.get("/", async (req, res) => {
  try {
    const news = await PoliticalNews.find({})
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .populate("user", "firstName lastName email"); // Populate user with selected fields
    res.send(news);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//=====================================
// Fetch political news article by ID (populate user)
//=====================================
politicalNewsRouter.get("/:id", async (req, res) => {
  try {
    const news = await PoliticalNews.findById(req.params.id).populate(
      "user",
      "firstName lastName email"
    ); // Populate user with selected fields
    if (news) {
      res.send(news);
    } else {
      res.status(404).send({ message: "Political News Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//=====================================
// Fetch political news article by slug (populate user)
//=====================================
politicalNewsRouter.get("/slug/:slug", async (req, res) => {
  try {
    const news = await PoliticalNews.findOne({
      slug: req.params.slug,
    }).populate("user", "firstName lastName email"); // Populate user with selected fields
    if (news) {
      res.send(news);
    } else {
      res.status(404).send({ message: "Political News Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//==============================
// Update political news article
//==============================
politicalNewsRouter.put("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const news = await PoliticalNews.findById(req.params.id);
    if (news) {
      news.title = req.body.title || news.title;
      news.image = req.body.image || news.image;
      news.description = req.body.description || news.description;
      const updatedNews = await news.save();
      res.send({ message: "Political News Updated", news: updatedNews });
    } else {
      res.status(404).send({ message: "Political News Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//===============================
// Delete political news article
//===============================
politicalNewsRouter.delete("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const news = await PoliticalNews.findById(req.params.id);
    if (news) {
      await news.deleteOne();
      res.send({ message: "Political News Deleted" });
    } else {
      res.status(404).send({ message: "Political News Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default politicalNewsRouter;
