import { connectDB } from "@/lib/connectDB";

import BannedUsers from "@/models/bannedUser";
import { response } from "@/lib/healperFunc";
import Tokens from "@/models/Tokens";

export async function POST(req) {
  try {
    await connectDB();

    const { userId, email } = await req.json();
    if (!userId || !email)
      return response(false, 400, "userId and email are required");

    // Find all tokens of this user
    const tokens = await Tokens.find({ userId }).lean();
    if (!tokens.length)
      return response(false, 404, "No tokens found for this user");

    const bannedResults = { banned: [], skipped: [] };

    for (const tokenDoc of tokens) {
      const exists = await BannedUsers.findOne({ token: tokenDoc.token });
      if (exists) {
        bannedResults.skipped.push(tokenDoc.token);
        continue;
      }

      await BannedUsers.create({
        userId: tokenDoc.userId,
        token: tokenDoc.token,
        email,
      });

      bannedResults.banned.push(tokenDoc.token);
    }

    if (!bannedResults.banned.length) {
      return response(
        false,
        400,
        "All tokens for this user are already banned",
        bannedResults,
      );
    }

    return response(
      true,
      200,
      "User tokens banned successfully",
      bannedResults,
    );
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return response(false, 400, "User already banned", err.message);
    }
    return response(false, 500, "Server error", err.message);
  }
}
