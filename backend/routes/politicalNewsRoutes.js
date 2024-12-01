import express from "express";
import { isAuth, isAdmin } from "../utils.js";
import PoliticalNews from "../models/politicalNewsModels.js";
import expressAsyncHandler from "express-async-handler";

const politicalNewsRouter = express.Router();

//=====================================
// Create a new political news article
//=====================================
politicalNewsRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const { title, image, description } = req.body;
      const politicalNews = new PoliticalNews({
        title,
        image,
        description,
        user: req.user._id,
      });
      const createdNews = await politicalNews.save();

      // Invalidate cache

      res
        .status(201)
        .send({ message: "Political News Created", news: createdNews });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//=====================================
// Fetch all political news articles (latest first) with caching
//=====================================
politicalNewsRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const news = await PoliticalNews.find({})
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .populate("user", "firstName lastName email"); // Populate user with selected fields

      res.json(news);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//=====================================
// Fetch latest 8 political news articles with caching
//=====================================
politicalNewsRouter.get(
  "/latest",
  expressAsyncHandler(async (req, res) => {
    try {
      // Fetch the latest 8 political news articles from MongoDB
      const news = await PoliticalNews.find({})
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .limit(8) // Limit the results to 8 articles
        .populate("user", "firstName lastName email"); // Populate user with selected fields

      res.json(news);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//==================
// Fetch all political news articles with pagination, sorted by latest createdAt
//==================
politicalNewsRouter.get(
  "/admin",
  // isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Parse the page number from the query, default to 1
      const limit = 5; // Set the limit to 5 news articles per page
      const skip = (page - 1) * limit; // Calculate the number of documents to skip

      // Sort the news by createdAt in descending order to get the latest first
      const news = await PoliticalNews.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "firstName lastName email") // Populate user with selected fields
        .exec();

      const totalNews = await PoliticalNews.countDocuments(); // Get the total number of news articles

      res.json({
        news,
        currentPage: page,
        totalPages: Math.ceil(totalNews / limit),
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//=====================================
// Fetch political news article by ID (populate user) with caching
//=====================================
politicalNewsRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const news = await PoliticalNews.findById(req.params.id).populate(
        "user",
        "firstName lastName email"
      );

      if (news) {
        // Cache the response for 10 minutes
        res.json(news);
      } else {
        res.status(404).send({ message: "Political News Not Found" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//=====================================
// Fetch political news article by slug (populate user)
//=====================================
politicalNewsRouter.get(
  "/slug/:slug",
  expressAsyncHandler(async (req, res) => {
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
  })
);

//==============================
// Update political news article
//==============================
politicalNewsRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
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
  })
);

//===============================
// Delete political news article
//===============================
politicalNewsRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
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
  })
);

export default politicalNewsRouter;
