import express from "express";
import expressAsyncHandler from "express-async-handler";
import Bills from "../models/billsModels.js";
import Election from "../models/electionModels.js";

const generalRouter = express.Router();

//===============================
// Merge Bills and Elections Routes
//===============================
generalRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      // Fetch bills with a limit of 4, sorted by creation date
      const bills = await Bills.aggregate([
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
          },
        },
      ]);

      // Fetch elections with a limit of 4, sorted by creation date
      const elections = await Election.aggregate([
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
        { $sort: { createdAt: -1 } }, // Sort by creation date (latest first)
        { $limit: 4 }, // Limit to 4 items
      ]);

      // Combine the results and sort again by createdAt to ensure overall order
      const combined = [...bills, ...elections]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 8);

      res.send({
        data: combined,
        type: "combined",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

export default generalRouter;
