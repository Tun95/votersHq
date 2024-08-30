import express from "express";
import { isAuth, isAdmin } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import { Server } from "socket.io";
import http from "http";
import Election from "../models/electionModels.js";
import UserActivity from "../models/userActivitiesModels.js";
import User from "../models/userModels.js";

const electionRouter = express.Router();

// Create a Socket.IO server
const server = http.createServer();
const io = new Server(server);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected to election updates");
});

// Middleware to broadcast election updates to connected clients
electionRouter.use((req, res, next) => {
  req.io = io;
  next();
});

//======================
// Create a new election
//======================
electionRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const electionData = req.body;

      // Associate the user ID with the election
      electionData.user = req.user._id;

      const election = new Election(electionData);
      await election.validate(); // Manually trigger validation if needed

      const createdElection = await election.save();

      // Broadcast the created election to connected clients
      io.emit("electionUpdate", { election: createdElection });

      res.status(201).send(createdElection);
    } catch (error) {
      console.error("Error creating election:", error);
      res.status(400).json({ message: error.message }); // Return validation error
    }
  })
);

//======================
// Fetch all elections sorted by latest
//======================
electionRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const elections = await Election.find({})
        .populate("candidates")
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .exec();

      res.send(elections);
    } catch (error) {
      console.error("Error fetching elections:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//======================
// Filter, sort, categorize elections, and aggregate total votes and progress
//======================
electionRouter.get(
  "/filter",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const searchQuery = query.searchQuery || "all";
    const sortType = query.sortType || "all";
    const sortStatus = query.sortStatus || "all";
    const sortCategory = query.sortCategory || "all";
    const order = query.sortOrder || "all";

    // Filters
    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            title: {
              $regex: searchQuery,
              $options: "i", // Case-insensitive search
            },
          }
        : {};

    const typeFilter =
      sortType && sortType !== "all"
        ? { sortType: { $in: sortType.split(",") } }
        : {};

    const statusFilter =
      sortStatus && sortStatus !== "all"
        ? { sortStatus: { $in: sortStatus.split(",") } }
        : {};

    const categoryFilter =
      sortCategory && sortCategory !== "all"
        ? { sortCategory: { $in: sortCategory.split(",") } }
        : {};

    // Sorting logic
    const sortOrder = (() => {
      switch (order) {
        case "trending":
          return { views: -1 }; // Sort by most viewed (trending)
        case "general":
          return { createdAt: -1 }; // General view can show the latest by default
        case "all":
        default:
          return { createdAt: -1 }; // Default to showing the latest bills
      }
    })();

    const filters = {
      ...queryFilter,
      ...typeFilter,
      ...statusFilter,
      ...categoryFilter,
    };

    try {
      // Fetch and categorize elections with total votes and progress aggregation
      const [ongoing, upcoming, concluded] = await Promise.all([
        Election.aggregate([
          { $match: { ...filters, status: "ongoing" } },
          {
            $addFields: {
              totalVotes: { $size: "$votes" },
              progress: {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: [new Date(), "$createdAt"] },
                      { $subtract: ["$expirationDate", "$createdAt"] },
                    ],
                  },
                  100,
                ],
              },
            },
          },
          { $sort: sortOrder },
        ]).exec(),

        Election.find({ ...filters, status: "upcoming" })
          .populate("candidates")
          .sort(sortOrder)
          .exec(),

        Election.aggregate([
          { $match: { ...filters, status: "concluded" } },
          {
            $addFields: {
              totalVotes: { $size: "$votes" },
            },
          },
          { $sort: sortOrder },
        ]).exec(),
      ]);

      res.send({
        ongoing,
        upcoming,
        concluded,
      });
    } catch (error) {
      console.error("Error fetching elections:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//======================
// Fetch election by ID
//======================
electionRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.id).populate(
        "candidates"
      );
      if (election) {
        res.send(election);
      } else {
        res.status(404).send({ message: "Election not found" });
      }
    } catch (error) {
      console.error("Error fetching election by ID:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//======================
// Fetch election by slug and increment views
//======================
electionRouter.get(
  "/slug/:slug",
  expressAsyncHandler(async (req, res) => {
    try {
      // Fetch the election and populate candidates
      const election = await Election.findOne({
        slug: req.params.slug,
      }).populate("candidates");

      if (!election) {
        return res.status(404).send({ message: "Election not found" });
      }

      // Increment the views count
      election.views += 1;
      await election.save();

      // Sort comments and replies
      election.comments.sort((a, b) => b.createdAt - a.createdAt); // Sort comments by latest first

      election.comments.forEach((comment) => {
        comment.replies.sort((a, b) => b.createdAt - a.createdAt); // Sort replies by latest first
      });

      // Aggregation pipeline to calculate total votes and votes based on gender
      const votesAggregation = await Election.aggregate([
        { $match: { slug: req.params.slug } },
        { $unwind: "$votes" },
        {
          $lookup: {
            from: "users",
            localField: "votes.voterId",
            foreignField: "_id",
            as: "voterDetails",
          },
        },
        { $unwind: "$voterDetails" }, // Ensure we don't have an array but individual voter details
        {
          $group: {
            _id: null,
            totalVotes: { $sum: 1 },
            maleVotes: {
              $sum: {
                $cond: [{ $eq: ["$voterDetails.gender", "male"] }, 1, 0],
              },
            },
            femaleVotes: {
              $sum: {
                $cond: [{ $eq: ["$voterDetails.gender", "female"] }, 1, 0],
              },
            },
          },
        },
      ]);

      const totalVotesCount =
        votesAggregation.length > 0 ? votesAggregation[0].totalVotes : 1;

      // Aggregation pipeline to calculate the leaderboard for top 5 candidates
      const leaderboardAggregationTop5 = await Election.aggregate([
        { $match: { slug: req.params.slug } },
        { $unwind: "$votes" },
        {
          $group: {
            _id: "$votes.candidateId",
            totalVotes: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "candidateDetails",
          },
        },
        { $sort: { totalVotes: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            candidate: { $arrayElemAt: ["$candidateDetails", 0] },
            totalVotes: 1,
            votePercentage: {
              $multiply: [{ $divide: ["$totalVotes", totalVotesCount] }, 100],
            },
          },
        },
      ]);

      // Aggregation pipeline to calculate the leaderboard for top 3 candidates
      const leaderboardAggregationTop3 = await Election.aggregate([
        { $match: { slug: req.params.slug } },
        { $unwind: "$votes" },
        {
          $group: {
            _id: "$votes.candidateId",
            totalVotes: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "candidateDetails",
          },
        },
        { $sort: { totalVotes: -1 } },
        { $limit: 3 },
        {
          $project: {
            _id: 0,
            candidate: { $arrayElemAt: ["$candidateDetails", 0] },
            totalVotes: 1,
            votePercentage: {
              $multiply: [{ $divide: ["$totalVotes", totalVotesCount] }, 100],
            },
          },
        },
      ]);

      const ageRangeAggregation = await Election.aggregate([
        { $match: { slug: req.params.slug } },
        { $unwind: "$votes" },
        {
          $group: {
            _id: {
              $cond: [
                { $lt: [{ $toInt: "$votes.age" }, 26] },
                "18-25",
                {
                  $cond: [
                    { $lt: [{ $toInt: "$votes.age" }, 41] },
                    "26-40",
                    {
                      $cond: [
                        { $lt: [{ $toInt: "$votes.age" }, 61] },
                        "41-60",
                        "60+",
                      ],
                    },
                  ],
                },
              ],
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            ageRange: "$_id",
            percentage: {
              $multiply: [{ $divide: ["$count", totalVotesCount] }, 100],
            },
          },
        },
        { $sort: { percentage: -1 } },
      ]);

      // Ensure that all age ranges are included with 0 percentage if not present
      const ageRanges = ["18-25", "26-40", "41-60", "60+"];
      const ageRangeDistribution = ageRanges.map((range) => {
        const foundRange = ageRangeAggregation.find(
          (item) => item.ageRange === range
        );
        return {
          ageRange: range,
          percentage: foundRange ? foundRange.percentage : 0,
        };
      });

      const [totalVotesData] = votesAggregation;
      res.send({
        election,
        totalVotes: totalVotesData ? totalVotesData.totalVotes : 0,
        maleVotes: totalVotesData ? totalVotesData.maleVotes : 0,
        femaleVotes: totalVotesData ? totalVotesData.femaleVotes : 0,
        leaderboardTop5: leaderboardAggregationTop5,
        leaderboardTop3: leaderboardAggregationTop3,
        ageRangeDistribution,
      });

    } catch (error) {
      console.error("Error fetching election by slug:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//======================
// Update election
//======================
electionRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.id);
      if (election) {
        // Update all fields from the request body
        Object.assign(election, req.body);

        const updatedElection = await election.save();

        // Broadcast the updated election to connected clients
        io.emit("electionUpdate", { election: updatedElection });

        res.send(updatedElection);
      } else {
        res.status(404).send({ message: "Election not found" });
      }
    } catch (error) {
      console.error("Error updating election:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//======================
// Delete election
//======================
electionRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const electionId = req.params.id;

      // Delete the election document from the database
      const result = await Election.deleteOne({ _id: electionId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Election not found" });
      }

      // Broadcast the deletion to connected clients
      io.emit("electionUpdate", { election: null });

      res.status(200).json({ message: "Election deleted successfully" });
    } catch (error) {
      console.error("Error deleting election:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//======================
// Vote for a single candidate
//======================
electionRouter.post(
  "/:id/vote/:candidateId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.id);
      if (election) {
        // Check if the user's gender and age are set
        const user = await User.findById(req.user._id);
        if (!user.gender || !user.age) {
          return res.status(400).send({
            message:
              "Please update your profile with your gender and age before voting.",
          });
        }

        // Check if the user has already voted in this election
        const existingVote = election.votes.find(
          (vote) => vote.voterId.toString() === req.user._id.toString()
        );

        if (existingVote) {
          return res
            .status(400)
            .send({ message: "You have already voted in this election." });
        }

        const candidate = election.candidates.find(
          (c) => c._id.toString() === req.params.candidateId
        );

        if (candidate) {
          // Add the vote to the election's votes array with the user's age
          election.votes.push({
            voterId: req.user._id,
            candidateId: candidate._id,
            age: user.age, // Include the user's age
          });
          await election.save();

          // Broadcast the updated election to connected clients
          io.emit("electionUpdate", { election });

          // Log the activity
          const activity = new UserActivity({
            user: req.user._id,
            activityType: "Voted in an Election",
            activityDetails: `You cast your vote in the "${election.title}".`,
            relatedId: election._id,
            relatedModel: "Election",
          });
          await activity.save();
          res.send(election);
        } else {
          res.status(404).send({ message: "Candidate not found" });
        }
      } else {
        res.status(404).send({ message: "Election not found" });
      }
    } catch (error) {
      console.error("Error voting for candidate:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);


//======================
// Like an election
//======================
electionRouter.post(
  "/:id/like",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.id);
      if (election) {
        // If the user has disliked the election, remove the dislike
        if (election.dislikes.includes(req.user._id)) {
          election.dislikes = election.dislikes.filter(
            (userId) => userId.toString() !== req.user._id.toString()
          );
        }

        // Check if the user has already liked the election
        if (!election.likes.includes(req.user._id)) {
          election.likes.push(req.user._id);
          const updatedElection = await election.save();

          // Broadcast the updated election to connected clients
          io.emit("electionUpdate", { election: updatedElection });

          res.send(updatedElection);
        } else {
          res
            .status(400)
            .send({ message: "You have already liked this election" });
        }
      } else {
        res.status(404).send({ message: "Election not found" });
      }
    } catch (error) {
      console.error("Error liking election:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//======================
// Dislike an election
//======================
electionRouter.post(
  "/:id/dislike",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.id);
      if (election) {
        // If the user has liked the election, remove the like
        if (election.likes.includes(req.user._id)) {
          election.likes = election.likes.filter(
            (userId) => userId.toString() !== req.user._id.toString()
          );
        }

        // Check if the user has already disliked the election
        if (!election.dislikes.includes(req.user._id)) {
          election.dislikes.push(req.user._id);
          const updatedElection = await election.save();

          // Broadcast the updated election to connected clients
          io.emit("electionUpdate", { election: updatedElection });

          res.send(updatedElection);
        } else {
          res
            .status(400)
            .send({ message: "You have already disliked this election" });
        }
      } else {
        res.status(404).send({ message: "Election not found" });
      }
    } catch (error) {
      console.error("Error disliking election:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//======================
// Set expiration date for an election
//======================
electionRouter.post(
  "/set-expiration/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.id);
      if (election) {
        election.expirationDate =
          req.body.expirationDate || election.expirationDate;
        const updatedElection = await election.save();

        // Broadcast the updated election to connected clients
        io.emit("electionUpdate", { election: updatedElection });

        res.send(updatedElection);
      } else {
        res.status(404).send({ message: "Election not found" });
      }
    } catch (error) {
      console.error("Error setting expiration date:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//****************************************
// Comment Routes
//****************************************

//===============================
// Create a new comment on an election
//===============================
electionRouter.post(
  "/:electionId/comments",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.electionId);
      if (!election) {
        return res.status(404).send({ message: "Election not found" });
      }

      const newComment = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        image: req.user.image,
        commentContent: req.body.commentContent,
        user: req.user._id,
      };

      election.comments.push(newComment);
      await election.save();

      // Broadcast the new comment to connected clients
      io.emit("electionUpdate", { election });

      // Log the activity
      const activity = new UserActivity({
        user: req.user._id,
        activityType: "Commented on an Election",
        activityDetails: `You commented on the "${election.title}". Join the conversation and share your views `,
        relatedId: election._id,
        relatedModel: "Election",
      });
      await activity.save();
      res.status(201).send({ message: "Comment added", comment: newComment });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Update a comment on an election
//===============================
electionRouter.put(
  "/:electionId/comments/:commentId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.electionId);
      if (!election) {
        return res.status(404).send({ message: "Election not found" });
      }

      const comment = election.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      if (comment.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .send({ message: "You can only edit your own comments" });
      }

      comment.commentContent =
        req.body.commentContent || comment.commentContent;
      await election.save();

      // Broadcast the updated comment to connected clients
      io.emit("electionUpdate", { election });

      res.send({ message: "Comment updated", comment });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Delete a comment on an election
//===============================
electionRouter.delete(
  "/:electionId/comments/:commentId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.electionId);
      if (!election) {
        return res.status(404).send({ message: "Election not found" });
      }

      const comment = election.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      if (comment.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .send({ message: "You can only delete your own comments" });
      }

      comment.deleteOne();
      await election.save();

      // Broadcast the deleted comment to connected clients
      io.emit("electionUpdate", { election });

      res.send({ message: "Comment deleted" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Create a reply on a comment in an election
//===============================
electionRouter.post(
  "/:electionId/comments/:commentId/replies",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.electionId);
      if (!election) {
        return res.status(404).send({ message: "Election not found" });
      }

      const comment = election.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      const newReply = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        image: req.user.image,
        replyContent: req.body.replyContent,
        mentionedUser: req.body.mentionedUser,
        user: req.user._id,
      };

      comment.replies.push(newReply);
      await election.save();

      // Broadcast the new reply to connected clients
      io.emit("electionUpdate", { election });

      res.status(201).send({ message: "Reply added", reply: newReply });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Update a reply on a comment in an election
//===============================
electionRouter.put(
  "/:electionId/comments/:commentId/replies/:replyId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.electionId);
      if (!election) {
        return res.status(404).send({ message: "Election not found" });
      }

      const comment = election.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      const reply = comment.replies.id(req.params.replyId);
      if (!reply) {
        return res.status(404).send({ message: "Reply not found" });
      }

      if (reply.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .send({ message: "You can only edit your own replies" });
      }

      reply.replyContent = req.body.replyContent || reply.replyContent;
      reply.mentionedUser = req.body.mentionedUser || reply.mentionedUser;

      await election.save();

      // Broadcast the updated reply to connected clients
      io.emit("electionUpdate", { election });

      res.send({ message: "Reply updated", reply });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Delete a reply on a comment in an election
//===============================
electionRouter.delete(
  "/:electionId/comments/:commentId/replies/:replyId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.electionId);
      if (!election) {
        return res.status(404).send({ message: "Election not found" });
      }

      const comment = election.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      const reply = comment.replies.id(req.params.replyId);
      if (!reply) {
        return res.status(404).send({ message: "Reply not found" });
      }

      if (reply.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .send({ message: "You can only delete your own replies" });
      }

      reply.deleteOne();
      await election.save();

      // Broadcast the deleted reply to connected clients
      io.emit("electionUpdate", { election });

      res.send({ message: "Reply deleted" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//****************************************
// LIKE AND DISLIKE Comment and Replies Routes
//****************************************

//===============================
// Like a comment on an election
//===============================
electionRouter.post(
  "/:electionId/comments/:commentId/like",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.electionId);
      if (!election) {
        return res.status(404).send({ message: "Election not found" });
      }

      const comment = election.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      // Check if the user has already liked the comment
      if (comment.likes.includes(req.user._id)) {
        return res
          .status(400)
          .send({ message: "You have already liked this comment" });
      }

      // Remove user from dislikes if they have disliked
      comment.dislikes = comment.dislikes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );

      // Add like
      comment.likes.push(req.user._id);

      await election.save();

      // Broadcast the liked comment to connected clients
      io.emit("electionUpdate", { election });

      res.send({ message: "Comment liked", comment });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Dislike a comment on an election
//===============================
electionRouter.post(
  "/:electionId/comments/:commentId/dislike",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.electionId);
      if (!election) {
        return res.status(404).send({ message: "Election not found" });
      }

      const comment = election.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      // Check if the user has already disliked the comment
      if (comment.dislikes.includes(req.user._id)) {
        return res
          .status(400)
          .send({ message: "You have already disliked this comment" });
      }

      // Remove user from likes if they have liked
      comment.likes = comment.likes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );

      // Add dislike
      comment.dislikes.push(req.user._id);

      await election.save();

      // Broadcast the disliked comment to connected clients
      io.emit("electionUpdate", { election });

      res.send({ message: "Comment disliked", comment });
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.log("DISLIKE COMMENT:", error);
    }
  })
);

//===============================
// Like a reply on a comment in an election
//===============================
electionRouter.post(
  "/:electionId/comments/:commentId/replies/:replyId/like",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.electionId);
      if (!election) {
        return res.status(404).send({ message: "Election not found" });
      }

      const comment = election.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      const reply = comment.replies.id(req.params.replyId);
      if (!reply) {
        return res.status(404).send({ message: "Reply not found" });
      }

      // Check if the user has already liked the reply
      if (reply.likes.includes(req.user._id)) {
        return res
          .status(400)
          .send({ message: "You have already liked this reply" });
      }

      // Remove user from dislikes if they have disliked
      reply.dislikes = reply.dislikes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );

      // Add like
      reply.likes.push(req.user._id);

      await election.save();

      // Broadcast the liked reply to connected clients
      io.emit("electionUpdate", { election });

      res.send({ message: "Reply liked", reply });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Dislike a reply on a comment in an election
//===============================
electionRouter.post(
  "/:electionId/comments/:commentId/replies/:replyId/dislike",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const election = await Election.findById(req.params.electionId);
      if (!election) {
        return res.status(404).send({ message: "Election not found" });
      }

      const comment = election.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      const reply = comment.replies.id(req.params.replyId);
      if (!reply) {
        return res.status(404).send({ message: "Reply not found" });
      }

      // Check if the user has already disliked the reply
      if (reply.dislikes.includes(req.user._id)) {
        return res
          .status(400)
          .send({ message: "You have already disliked this reply" });
      }

      // Remove user from likes if they have liked
      reply.likes = reply.likes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );

      // Add dislike
      reply.dislikes.push(req.user._id);

      await election.save();

      // Broadcast the disliked reply to connected clients
      io.emit("electionUpdate", { election });

      res.send({ message: "Reply disliked", reply });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

export default electionRouter;
