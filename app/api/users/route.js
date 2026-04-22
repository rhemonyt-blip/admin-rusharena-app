// app/api/admin/users/route.js

import { connectDB } from "@/lib/connectDB";
import User from "@/models/user";
import { response } from "@/lib/healperFunc";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    // If no search provided
    if (!search) {
      return response(false, 400, "Search query is required");
    }
    const query = search !== "allUser" ? { name: search } : {};

    const users = await User.find(query).lean();
    if (!users.length) {
      return response(false, 404, "No users found");
    }

    return response(true, 200, "Users fetched", users);
  } catch (err) {
    console.error(err);
    return response(false, 500, "Server error", err.message);
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const { userId, winbalance, dipositbalance } = await req.json();

    if (!userId || winbalance === undefined || dipositbalance === undefined) {
      return response(
        false,
        400,
        "userId, winbalance, and dipositbalance are required",
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { winbalance, dipositbalance },
      { new: true },
    ).lean();

    if (!updatedUser) {
      return response(false, 404, "User not found");
    }

    return response(true, 200, "User balances updated", updatedUser);
  } catch (err) {
    console.error(err);
    return response(false, 500, "Server error", err.message);
  }
}
