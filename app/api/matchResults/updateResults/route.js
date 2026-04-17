// app/api/matches/updateResults/route.js

import mongoose from "mongoose";
import { connectDB } from "@/lib/connectDB";
import { response } from "@/lib/healperFunc";
import User from "@/models/user";
import MyMathes from "@/models/myMatch";
import ResultMatches from "@/models/resultMatch";
import myMatch from "@/models/myMatch";

export async function POST(req) {
  const session = await mongoose.startSession();

  try {
    await connectDB();

    const { matchId, results } = await req.json();

    // ✅ Validation
    if (!matchId || !results || !Array.isArray(results)) {
      return response(false, 400, "matchId and results are required");
    }

    // ✅ Start transaction
    session.startTransaction();

    // ✅ Find match
    const match = await ResultMatches.findById(matchId).session(session);
    if (!match) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 404, "Match not found");
    }

    // ✅ Validate prize pool
    const totalWinning = results.reduce((sum, r) => sum + (r.winning || 0), 0);

    if (totalWinning > match.winPrize) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 400, "Prize pool exceeded");
    }

    const notFoundPlayers = [];
    const updatedPlayers = [];
    const finalResults = [];

    // ✅ Process players
    for (const result of results) {
      const { playerId, kills = 0, winning = 0 } = result;

      const joinedPlayer = match.joinedPlayers.find(
        (p) => p.authId === playerId,
      );

      if (!joinedPlayer) {
        notFoundPlayers.push(playerId);
        continue;
      }

      const user = await User.findById(playerId).session(session);

      if (!user) {
        notFoundPlayers.push(playerId);
        continue;
      }
      const newWinBalance = winning - joinedPlayer.winning || 0;

      // ✅ Update balance
      user.winbalance = (user.winbalance || 0) + newWinBalance;
      await user.save({ session });

      updatedPlayers.push(user._id);

      await MyMathes.findByIdAndUpdate(
        match._myMatchId,
        {
          $set: {
            userId: user._id,
            title: match.title,
            time: match.startTime,
            myKills: kills.toString(),
            myWin: winning.toString(),
          },
        },
        { session, new: true },
      );

      // ✅ Collect results
      finalResults.push({
        name: joinedPlayer.name,
        authId: joinedPlayer.authId,
        kills,
        winning,
      });
    }

    // ✅ Create ResultMatches (single doc)
    await ResultMatches.create(
      [
        {
          myMatchId: match._id,
          title: match.title,
          matchType: match.matchType,
          winPrize: match.winPrize,
          perKill: match.perKill,
          entryFee: match.entryFee,
          entryType: match.entryType,
          map: match.map,
          prizeDetails: match.prizeDetails,
          startTime: match.startTime,
          joinedPlayers: finalResults,
        },
      ],
      { session },
    );

    // ✅ Mark match completed
    match.status = "completed";
    await match.save({ session });

    // ✅ Commit everything
    await session.commitTransaction();
    session.endSession();

    return response(true, 200, "Results updated successfully", {
      updatedPlayers,
      notFoundPlayers,
    });
  } catch (error) {
    // ❌ Rollback everything if ANY error happens
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction Error:", error);
    return response(false, 500, "Server error", error.message);
  }
}
