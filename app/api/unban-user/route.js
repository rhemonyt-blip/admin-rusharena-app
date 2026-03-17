import { connectDB } from "@/lib/connectDB";
import BannedUsers from "@/models/bannedUser";
import { response } from "@/lib/healperFunc";

export async function POST(req) {
  try {
    await connectDB();

    const { userId, email } = await req.json();
    if (!userId || !email) {
      return response(false, 400, "userId and email are required");
    }

    // Delete all banned tokens for this user
    const result = await BannedUsers.deleteMany({ userId, email });

    if (!result.deletedCount) {
      return response(false, 404, "No banned tokens found for this user");
    }

    return response(true, 200, "User tokens unbanned successfully", {
      unbannedCount: result.deletedCount,
    });
  } catch (err) {
    console.error(err);
    return response(false, 500, "Server error", err.message);
  }
}
