import express from "express";
import expressAsyncHandler from "express-async-handler";
import Bills from "../models/billsModels.js";
import Election from "../models/electionModels.js";
import { isAdmin, isAuth } from "../utils.js";
import User from "../models/userModels.js";
import PoliticalNews from "../models/politicalNewsModels.js";

const generalRouter = express.Router();

//===============================
// Merge Bills and Elections Routes
//===============================
generalRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      // Fetch featured bills, sorted by creation date
      const bills = await Bills.aggregate([
        {
          $match: {
            featured: true,
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

      // Fetch featured elections, sorted by creation date
      const elections = await Election.aggregate([
        {
          $match: {
            featured: true,
          },
        },
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
      ]);

      // Combine the results and sort again by createdAt to ensure overall order
      const combined = [...bills, ...elections].sort(
        (a, b) => b.createdAt - a.createdAt
      );

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

//===========
// SUMMARY
//===========
const getBillsVotesLast10Days = async () => {
  const billsVotes = await Bills.aggregate([
    {
      $facet: {
        yeaVotes: [
          { $unwind: "$yeaVotes" },
          { $match: { "yeaVotes.createdAt": { $exists: true } } },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$yeaVotes.createdAt",
                },
              },
              totalVotes: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $project: { _id: 0, date: "$_id", totalVotes: 1 } },
        ],
        nayVotes: [
          { $unwind: "$nayVotes" },
          { $match: { "nayVotes.createdAt": { $exists: true } } },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$nayVotes.createdAt",
                },
              },
              totalVotes: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $project: { _id: 0, date: "$_id", totalVotes: 1 } },
        ],
      },
    },
    {
      $project: {
        votes: {
          $concatArrays: ["$yeaVotes", "$nayVotes"],
        },
      },
    },
    { $unwind: "$votes" },
    {
      $group: {
        _id: "$votes.date",
        totalVotes: { $sum: "$votes.totalVotes" },
      },
    },
    { $sort: { _id: -1 } },
    { $limit: 10 },
    { $sort: { _id: 1 } },
  ]);

  return billsVotes;
};

const getElectionVotesLast10Days = async () => {
  const electionVotes = await Election.aggregate([
    {
      $unwind: "$votes",
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$votes.createdAt" },
        },
        totalVotes: { $sum: 1 }, // Count votes
      },
    },
    {
      $sort: { _id: 1 }, // Sort by date
    },
    {
      $addFields: {
        date: "$_id",
        totalVotes: "$totalVotes",
      },
    },
    {
      $project: {
        _id: 0,
        date: 1,
        totalVotes: 1,
      },
    },
    {
      $sort: { _id: -1 }, // Sort by date descending
    },
    {
      $limit: 10, // Last 10 days
    },
    {
      $sort: { _id: 1 }, // Sort by date ascending for the chart
    },
  ]);
  return electionVotes;
};
generalRouter.get(
  "/summary",
  expressAsyncHandler(async (req, res) => {
    const [usersCount, billsCount, electionsCount, politicalNewsCount] =
      await Promise.all([
        User.countDocuments(),
        Bills.countDocuments(),
        Election.countDocuments(),
        PoliticalNews.countDocuments(),
      ]);

    const billsVotes = await getBillsVotesLast10Days();
    const electionVotes = await getElectionVotesLast10Days();

    const last10Days = Array.from(
      { length: 10 },
      (_, i) =>
        new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
    ).reverse();

    const mergedVotes = last10Days.map((date) => {
      const billsVote = billsVotes.find((v) => v._id === date) || {
        totalVotes: 0,
      };
      const electionVote = electionVotes.find((v) => v.date === date) || {
        totalVotes: 0,
      };

      return {
        date,
        billsVotes: billsVote.totalVotes,
        electionVotes: electionVote.totalVotes,
      };
    });

    res.send({
      users: usersCount,
      bills: billsCount,
      elections: electionsCount,
      news: politicalNewsCount,
      votes: mergedVotes,
    });
  })
);

export default generalRouter;
