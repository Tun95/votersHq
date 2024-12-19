import express from "express";
import Bills from "../models/billsModels.js";
import expressAsyncHandler from "express-async-handler";
import { isAdmin, isAuth } from "../utils.js";
import User from "../models/userModels.js";
import UserActivity from "../models/userActivitiesModels.js";

const billsRouter = express.Router();

//===============================
// Create a new bill
//===============================
billsRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const {
        title,
        image,
        banner,
        description,
        featured,
        sortType,
        sortStatus,
        sortCategory,
        sortState,
        candidates,
        expirationDate,
      } = req.body;

      // Validate required fields
      if (
        !title ||
        !image ||
        !banner ||
        !description ||
        !sortType ||
        !sortStatus ||
        !sortCategory ||
        !sortState ||
        !candidates ||
        !expirationDate
      ) {
        return res.status(400).send({ message: "All fields are required" });
      }

      // Check if expirationDate is in the past
      const currentDate = new Date();
      if (new Date(expirationDate) < currentDate) {
        return res.status(400).send({
          message: "Expiration date cannot be in the past",
        });
      }

      // Create new bill
      const bill = new Bills({
        title,
        image,
        banner,
        description,
        featured,
        sortType,
        sortStatus,
        sortCategory,
        sortState,
        candidates,
        expirationDate,
        slug: "", // This will be generated in the pre-save middleware
        user: req.user._id,
      });

      // Save to database
      const createdBill = await bill.save();
      res.status(201).send({ message: "Bill Created", bill: createdBill });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Fetch all bills (including candidate details)
//===============================
billsRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const bills = await Bills.find({})
        .populate("user") // Populates the user who created the bill
        .populate({
          path: "candidates", // Populates the candidates field
          model: "User", // Specifies the model to populate from
        })
        .sort({ createdAt: -1 }); // Sort by latest (most recent first)

      res.send(bills);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Filter, sort, categorize bills, and aggregate total votes (yea, nay)
//===============================
const PAGE_SIZE = 9;
billsRouter.get(
  "/filter",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const searchQuery = query.searchQuery || "all";
    const sortType = query.sortType || "all";
    const sortStatus = query.sortStatus || "all";
    const sortCategory = query.sortCategory || "all";
    const sortState = query.sortState || "all";
    const order = query.sortOrder || "all";
    const pageSize = Number(query.pageSize) || PAGE_SIZE;
    const page = Number(query.page) || 1;

    // Filters
    const queryFilter =
      searchQuery !== "all"
        ? {
            title: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};

    const typeFilter =
      sortType !== "all" ? { sortType: { $in: sortType.split(",") } } : {};

    const statusFilter =
      sortStatus !== "all"
        ? { sortStatus: { $in: sortStatus.split(",") } }
        : {};

    const categoryFilter =
      sortCategory !== "all"
        ? { sortCategory: { $in: sortCategory.split(",") } }
        : {};

    const stateFilter =
      sortState !== "all" ? { sortState: { $in: sortState.split(",") } } : {};

    // Combine all filters
    const filters = {
      ...queryFilter,
      ...typeFilter,
      ...statusFilter,
      ...categoryFilter,
      ...stateFilter,
    };

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

    const cacheKey = `bills:filter:${JSON.stringify({
      searchQuery,
      sortType,
      sortStatus,
      sortCategory,
      sortState,
      order,
      pageSize,
      page,
    })}`;

    try {
      const bills = await Bills.aggregate([
        { $match: filters },
        {
          $addFields: {
            totalYeaVotes: { $size: "$yeaVotes" },
            totalNayVotes: { $size: "$nayVotes" },
            totalComments: { $size: "$comments" },
            yeaPercentage: {
              $cond: {
                if: {
                  $eq: [
                    { $add: [{ $size: "$yeaVotes" }, { $size: "$nayVotes" }] },
                    0,
                  ],
                },
                then: 0,
                else: {
                  $multiply: [
                    {
                      $divide: [
                        { $size: "$yeaVotes" },
                        {
                          $add: [
                            { $size: "$yeaVotes" },
                            { $size: "$nayVotes" },
                          ],
                        },
                      ],
                    },
                    100,
                  ],
                },
              },
            },
            nayPercentage: {
              $cond: {
                if: {
                  $eq: [
                    { $add: [{ $size: "$yeaVotes" }, { $size: "$nayVotes" }] },
                    0,
                  ],
                },
                then: 0,
                else: {
                  $multiply: [
                    {
                      $divide: [
                        { $size: "$nayVotes" },
                        {
                          $add: [
                            { $size: "$yeaVotes" },
                            { $size: "$nayVotes" },
                          ],
                        },
                      ],
                    },
                    100,
                  ],
                },
              },
            },
          },
        },
        { $sort: sortOrder },
        { $skip: pageSize * (page - 1) },
        { $limit: pageSize },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "users", // Collection to join with
            localField: "candidates", // Field from the `Bills` collection
            foreignField: "_id", // Field from the `users` collection
            as: "candidateDetails", // Alias for the joined data
          },
        },
        {
          $project: {
            title: 1,
            slug: 1,
            image: 1,
            banner: 1,
            description: 1,
            sortType: 1,
            sortStatus: 1,
            sortCategory: 1,
            sortState: 1,
            views: 1,
            expirationDate: 1,
            totalYeaVotes: 1,
            totalNayVotes: 1,
            totalComments: 1,
            yeaPercentage: 1,
            nayPercentage: 1,
            comments: 1,
            yeaVotes: 1,
            nayVotes: 1,
            createdAt: 1,
            updatedAt: 1,
            user: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              email: 1,
              image: 1,
              role: 1,
              stateOfOrigin: 1,
              stateOfResidence: 1,
              region: 1,
            },
            candidateDetails: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              slug: 1,
              email: 1,
              image: 1,
              role: 1,
              stateOfOrigin: 1,
              stateOfResidence: 1,
              region: 1,
            },
          },
        },
      ]);

      const countBills = await Bills.countDocuments(filters);

      const result = {
        bills,
        countBills,
        page,
        pages: Math.ceil(countBills / pageSize),
      };

      res.send(result);
    } catch (error) {
      console.error("Error fetching bills:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//===============================
// Update an existing bill
//===============================
billsRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findById(req.params.id);

      if (bill) {
        Object.assign(bill, req.body); // Merge new data with existing bill
        const updatedBill = await bill.save();
        res.send({ message: "Bill Updated", bill: updatedBill });
      } else {
        res.status(404).send({ message: "Bill Not Found" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Fetch a bill by ID
//===============================
billsRouter.get(
  "/:id",
  // isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findById(req.params.id).populate("user");
      if (bill) {
        res.send(bill);
      } else {
        res.status(404).send({ message: "Bill Not Found" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Fetch Related Bills with Aggregation
//===============================
billsRouter.get(
  "/:id/related",
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findById(req.params.id);
      if (!bill) {
        return res.status(404).send({ message: "Bill Not Found" });
      }

      const relatedBills = await Bills.aggregate([
        {
          $match: {
            _id: { $ne: bill._id }, // Exclude the current bill
            $or: [
              { sortCategory: { $in: bill.sortCategory } },
              { sortState: { $in: bill.sortState } },
            ],
          },
        },
        {
          $addFields: {
            totalYeaVotes: { $size: "$yeaVotes" },
            totalNayVotes: { $size: "$nayVotes" },
            totalComments: { $size: "$comments" },
            yeaPercentage: {
              $cond: {
                if: {
                  $eq: [
                    { $add: [{ $size: "$yeaVotes" }, { $size: "$nayVotes" }] },
                    0,
                  ],
                },
                then: 0,
                else: {
                  $multiply: [
                    {
                      $divide: [
                        { $size: "$yeaVotes" },
                        {
                          $add: [
                            { $size: "$yeaVotes" },
                            { $size: "$nayVotes" },
                          ],
                        },
                      ],
                    },
                    100,
                  ],
                },
              },
            },
            nayPercentage: {
              $cond: {
                if: {
                  $eq: [
                    { $add: [{ $size: "$yeaVotes" }, { $size: "$nayVotes" }] },
                    0,
                  ],
                },
                then: 0,
                else: {
                  $multiply: [
                    {
                      $divide: [
                        { $size: "$nayVotes" },
                        {
                          $add: [
                            { $size: "$yeaVotes" },
                            { $size: "$nayVotes" },
                          ],
                        },
                      ],
                    },
                    100,
                  ],
                },
              },
            },
          },
        },
        { $sort: { createdAt: -1 } }, // Sort by creation date (latest first)
        { $limit: 4 }, // Limit to 4 items
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "users",
            localField: "candidates",
            foreignField: "_id",
            as: "candidates",
          },
        },
        {
          $project: {
            title: 1,
            slug: 1,
            image: 1,
            banner: 1,
            description: 1,
            sortType: 1,
            sortStatus: 1,
            sortCategory: 1,
            sortState: 1,
            views: 1,
            expirationDate: 1,
            totalYeaVotes: 1,
            totalNayVotes: 1,
            totalComments: 1,
            yeaPercentage: 1,
            nayPercentage: 1,
            comments: 1,
            yeaVotes: 1,
            nayVotes: 1,
            createdAt: 1,
            updatedAt: 1,
            user: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              email: 1,
              image: 1,
              role: 1,
              stateOfOrigin: 1,
              stateOfResidence: 1,
              region: 1,
            },
            candidates: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              slug: 1,
              email: 1,
              image: 1,
              role: 1,
              stateOfOrigin: 1,
              stateOfResidence: 1,
              region: 1,
            },
          },
        },
      ]);

      res.send(relatedBills);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Fetch a bill by slug and update view count
//===============================
billsRouter.get(
  "/slug/:slug",
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findOneAndUpdate(
        { slug: req.params.slug },
        { $inc: { views: 1 } }, // Increment the view count
        { new: true } // Return the updated document
      )
        .populate("user")
        .populate("candidates"); // Populate the candidates field

      if (!bill) {
        return res.status(404).send({ message: "Bill Not Found" });
      }

      const aggregationResult = await Bills.aggregate([
        { $match: { _id: bill._id } },
        {
          $project: {
            totalVotes: {
              $add: [{ $size: "$yeaVotes" }, { $size: "$nayVotes" }],
            },
            totalYeaVotes: { $size: "$yeaVotes" },
            totalNayVotes: { $size: "$nayVotes" },
            yeaPercentage: {
              $cond: {
                if: {
                  $eq: [
                    { $add: [{ $size: "$yeaVotes" }, { $size: "$nayVotes" }] },
                    0,
                  ],
                },
                then: "0",
                else: {
                  $multiply: [
                    {
                      $divide: [
                        { $size: "$yeaVotes" },
                        {
                          $add: [
                            { $size: "$yeaVotes" },
                            { $size: "$nayVotes" },
                          ],
                        },
                      ],
                    },
                    100,
                  ],
                },
              },
            },
            nayPercentage: {
              $cond: {
                if: {
                  $eq: [
                    { $add: [{ $size: "$yeaVotes" }, { $size: "$nayVotes" }] },
                    0,
                  ],
                },
                then: "0",
                else: {
                  $multiply: [
                    {
                      $divide: [
                        { $size: "$nayVotes" },
                        {
                          $add: [
                            { $size: "$yeaVotes" },
                            { $size: "$nayVotes" },
                          ],
                        },
                      ],
                    },
                    100,
                  ],
                },
              },
            },
            regionalVotes: {
              $map: {
                input: [
                  "North Central",
                  "North East",
                  "North West",
                  "South East",
                  "South South",
                  "South West",
                ],
                as: "region",
                in: {
                  region: "$$region",
                  totalVotes: {
                    $size: {
                      $filter: {
                        input: { $concatArrays: ["$yeaVotes", "$nayVotes"] },
                        as: "vote",
                        cond: { $eq: ["$$vote.region", "$$region"] },
                      },
                    },
                  },
                  percentageVotes: {
                    $cond: {
                      if: {
                        $eq: [
                          {
                            $add: [
                              { $size: "$yeaVotes" },
                              { $size: "$nayVotes" },
                            ],
                          },
                          0,
                        ],
                      },
                      then: "0",
                      else: {
                        $multiply: [
                          {
                            $divide: [
                              {
                                $size: {
                                  $filter: {
                                    input: {
                                      $concatArrays: ["$yeaVotes", "$nayVotes"],
                                    },
                                    as: "vote",
                                    cond: {
                                      $eq: ["$$vote.region", "$$region"],
                                    },
                                  },
                                },
                              },
                              {
                                $add: [
                                  { $size: "$yeaVotes" },
                                  { $size: "$nayVotes" },
                                ],
                              },
                            ],
                          },
                          100,
                        ],
                      },
                    },
                  },
                },
              },
            },
            comments: {
              $map: {
                input: { $reverseArray: "$comments" }, // Sort comments by latest
                as: "comment",
                in: {
                  _id: "$$comment._id",
                  firstName: "$$comment.firstName",
                  lastName: "$$comment.lastName",
                  email: "$$comment.email",
                  image: "$$comment.image",
                  role: "$$comment.role",
                  commentContent: "$$comment.commentContent", // Correct field name
                  user: "$$comment.user",
                  likes: "$$comment.likes",
                  dislikes: "$$comment.dislikes",
                  createdAt: "$$comment.createdAt",
                  updatedAt: "$$comment.updatedAt",
                  replies: { $reverseArray: "$$comment.replies" }, // Sort replies by latest
                },
              },
            },
          },
        },
      ]);

      const result = aggregationResult[0];
      res.send({ ...bill.toObject(), ...result });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Delete a bill
//===============================
billsRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findById(req.params.id);
      if (bill) {
        await bill.deleteOne();
        res.send({ message: "Bill Deleted" });
      } else {
        res.status(404).send({ message: "Bill Not Found" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Cast a vote for a bill ("yea" or "nay")
//===============================
billsRouter.post(
  "/:id/vote",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { voteType } = req.body; // 'yea' or 'nay'
    const billId = req.params.id;
    const userId = req.user._id;

    const bill = await Bills.findById(billId);
    const user = await User.findById(userId); // Fetch the user to get their region, age, and ninNumber

    // Check if user profile is complete and meets voting criteria
    if (!user.gender || !user.age || !user.region || !user.ninNumber) {
      return res.status(400).send({
        message:
          "Please update your profile (including NIN and region) before voting.",
      });
    }

    if (user.age < 18) {
      return res.status(400).send({
        message: "You must be at least 18 years old to vote.",
      });
    }

    if (!bill) {
      return res.status(404).send({ message: "Bill not found" });
    }

    if (new Date() > bill.expirationDate) {
      return res.status(400).send({ message: "Voting period has ended" });
    }

    // Check if the user has already voted either "yea" or "nay"
    const alreadyVoted =
      bill.yeaVotes.some(
        (vote) => vote.voterId.toString() === userId.toString()
      ) ||
      bill.nayVotes.some(
        (vote) => vote.voterId.toString() === userId.toString()
      );

    if (alreadyVoted) {
      return res
        .status(400)
        .send({ message: "You have already cast your vote" });
    }

    if (voteType === "yea") {
      // Add user to yeaVotes with their region
      bill.yeaVotes.push({ voterId: userId, region: user.region });
    } else if (voteType === "nay") {
      // Add user to nayVotes with their region
      bill.nayVotes.push({ voterId: userId, region: user.region });
    } else {
      return res.status(400).send({ message: "Invalid vote type" });
    }

    // Log the activity
    const activity = new UserActivity({
      user: req.user._id,
      activityType: "Voted on a Bill",
      activityDetails: `You voted on the bill "${bill.title}".`,
      relatedId: bill._id,
      relatedModel: "Bill",
    });
    await activity.save();
    await bill.save();
    res.send({ message: `Successfully cast your ${voteType} vote` });
  })
);

//****************************************
// Comment Routes for Bills
//****************************************

//===============================
// Create a new comment on a bill
//===============================
billsRouter.post(
  "/:billId/comments",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findById(req.params.billId);
      if (!bill) {
        return res.status(404).send({ message: "Bill not found" });
      }

      const newComment = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        image: req.user.image,
        role: req.user.role,
        commentContent: req.body.commentContent, // updated field name
        user: req.user._id,
      };

      bill.comments.push(newComment);
      await bill.save();

      // Log the activity
      const activity = new UserActivity({
        user: req.user._id,
        activityType: "Commented on a Bill",
        activityDetails: `You commented on the bill "${bill.title}".`,
        relatedId: bill._id,
        relatedModel: "Bill",
      });
      await activity.save();

      res.status(201).send({ message: "Comment added", comment: newComment });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Update a comment on a bill
//===============================
billsRouter.put(
  "/:billId/comments/:commentId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findById(req.params.billId);
      if (!bill) {
        return res.status(404).send({ message: "Bill not found" });
      }

      const comment = bill.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      if (comment.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .send({ message: "You can only edit your own comments" });
      }

      comment.commentContent =
        req.body.commentContent || comment.commentContent; // updated field name
      await bill.save();

      res.send({ message: "Comment updated", comment });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Delete a comment on a bill
//===============================
billsRouter.delete(
  "/:billId/comments/:commentId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findById(req.params.billId);
      if (!bill) {
        return res.status(404).send({ message: "Bill not found" });
      }

      const comment = bill.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      if (comment.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .send({ message: "You can only delete your own comments" });
      }

      comment.deleteOne();
      await bill.save();

      res.send({ message: "Comment deleted" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Like a comment on a bill
//===============================
billsRouter.post(
  "/:billId/comments/:commentId/like",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findById(req.params.billId);
      if (!bill) {
        return res.status(404).send({ message: "Bill not found" });
      }

      const comment = bill.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      // Remove user from dislikes if they have disliked
      comment.dislikes = comment.dislikes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );

      // Add like if not already liked
      if (!comment.likes.includes(req.user._id)) {
        comment.likes.push(req.user._id);
      }

      await bill.save();

      res.send({ message: "Comment liked", comment });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Dislike a comment on a bill
//===============================
billsRouter.post(
  "/:billId/comments/:commentId/dislike",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findById(req.params.billId);
      if (!bill) {
        return res.status(404).send({ message: "Bill not found" });
      }

      const comment = bill.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      // Remove user from likes if they have liked
      comment.likes = comment.likes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );

      // Add dislike if not already disliked
      if (!comment.dislikes.includes(req.user._id)) {
        comment.dislikes.push(req.user._id);
      }

      await bill.save();

      res.send({ message: "Comment disliked", comment });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//****************************************
// Reply Routes for Bills
//****************************************

//===============================
// Create a reply on a comment in a bill
//===============================
billsRouter.post(
  "/:billId/comments/:commentId/replies",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findById(req.params.billId);
      if (!bill) {
        return res.status(404).send({ message: "Bill not found" });
      }

      const comment = bill.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      const newReply = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        image: req.user.image,
        role: req.user.role,
        replyContent: req.body.replyContent, // updated field name
        mentionedUser: req.body.mentionedUser,
        user: req.user._id,
      };

      comment.replies.push(newReply);
      await bill.save();

      res.status(201).send({ message: "Reply added", reply: newReply });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Update a reply on a comment in a bill
//===============================
billsRouter.put(
  "/:billId/comments/:commentId/replies/:replyId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findById(req.params.billId);
      if (!bill) {
        return res.status(404).send({ message: "Bill not found" });
      }

      const comment = bill.comments.id(req.params.commentId);
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

      reply.replyContent = req.body.replyContent || reply.replyContent; // updated field name
      reply.mentionedUser = req.body.mentionedUser || reply.mentionedUser;

      await bill.save();

      res.send({ message: "Reply updated", reply });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Delete a reply on a comment in a bill
//===============================
billsRouter.delete(
  "/:billId/comments/:commentId/replies/:replyId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findById(req.params.billId);
      if (!bill) {
        return res.status(404).send({ message: "Bill not found" });
      }

      const comment = bill.comments.id(req.params.commentId);
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
      await bill.save();

      res.send({ message: "Reply deleted" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Like a reply on a comment in a bill
//===============================
billsRouter.post(
  "/:billId/comments/:commentId/replies/:replyId/like",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findById(req.params.billId);
      if (!bill) {
        return res.status(404).send({ message: "Bill not found" });
      }

      const comment = bill.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      const reply = comment.replies.id(req.params.replyId);
      if (!reply) {
        return res.status(404).send({ message: "Reply not found" });
      }

      // Remove user from dislikes if they have disliked
      reply.dislikes = reply.dislikes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );

      // Add like if not already liked
      if (!reply.likes.includes(req.user._id)) {
        reply.likes.push(req.user._id);
      }

      await bill.save();

      res.send({ message: "Reply liked", reply });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

//===============================
// Dislike a reply on a comment in a bill
//===============================
billsRouter.post(
  "/:billId/comments/:commentId/replies/:replyId/dislike",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const bill = await Bills.findById(req.params.billId);
      if (!bill) {
        return res.status(404).send({ message: "Bill not found" });
      }

      const comment = bill.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      const reply = comment.replies.id(req.params.replyId);
      if (!reply) {
        return res.status(404).send({ message: "Reply not found" });
      }

      // Remove user from likes if they have liked
      reply.likes = reply.likes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );

      // Add dislike if not already disliked
      if (!reply.dislikes.includes(req.user._id)) {
        reply.dislikes.push(req.user._id);
      }

      await bill.save();

      res.send({ message: "Reply disliked", reply });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

export default billsRouter;
