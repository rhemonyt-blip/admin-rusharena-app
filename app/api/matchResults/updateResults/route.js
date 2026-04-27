import mongoose from "mongoose";
import { connectDB } from "@/lib/connectDB";
import { response } from "@/lib/healperFunc";
import User from "@/models/user";
import MyMatches from "@/models/myMatch";
import ResultMatches from "@/models/resultMatch";

export async function POST(req) {
  const session = await mongoose.startSession();

  try {
    await connectDB();

    const { matchId, results } = await req.json();

    // ✅ Basic validation
    if (!matchId || !Array.isArray(results) || results.length === 0) {
      return response(false, 400, "Invalid matchId or results");
    }

    await session.withTransaction(async () => {
      // ✅ Get match
      const match = await ResultMatches.findById(matchId).session(session);
      if (!match) throw new Error("Match not found");

      // ✅ Validate prize pool
      const totalWinning = results.reduce(
        (sum, r) => sum + (r.winning || 0),
        0,
      );

      if (totalWinning > match.winPrize) {
        throw new Error("Prize pool exceeded");
      }

      const playerMap = new Map(
        match.joinedPlayers.map((p) => [p.authId.toString(), p]),
      );

      const userIds = results.map((r) => r.playerId);
      const users = await User.find({ _id: { $in: userIds } }).session(session);

      const userMap = new Map(users.map((u) => [u._id.toString(), u]));

      const finalResults = [];
      const updatedPlayers = [];
      const notFoundPlayers = [];

      for (const { playerId, kills = 0, winning = 0 } of results) {
        const player = playerMap.get(playerId);
        const user = userMap.get(playerId);

        if (!player || !user) {
          notFoundPlayers.push(playerId);
          continue;
        }

        const prevWinning = player.winning || 0;
        const diff = winning - prevWinning;

        // ✅ Update balance safely
        user.winbalance = (user.winbalance || 0) + diff;
        await user.save({ session });

        updatedPlayers.push(user._id);

        finalResults.push({
          name: player.name,
          authId: player.authId,
          userName: player.userName,
          kills,
          winning,
        });

        // ✅ Update MyMatches (optional per user)
        await MyMatches.updateOne(
          { userId: user._id, matchId: match.myMatchId },
          {
            $set: {
              myKills: kills.toString(),
              myWin: winning.toString(),
            },
          },
          { session },
        );
      }

      // ✅ Update match results
      match.joinedPlayers = finalResults;
      match.status = "completed";
      await match.save({ session });

      return response(true, 200, "Results updated", {
        updatedPlayers,
        notFoundPlayers,
      });
    });

    return response(true, 200, "Transaction successful");
  } catch (error) {
    console.error("Transaction Error:", error);

    return response(false, 500, error.message || "Something went wrong");
  } finally {
    session.endSession();
  }
}
