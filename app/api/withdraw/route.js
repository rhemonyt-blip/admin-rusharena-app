import User from "@/models/user";

import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { catchError, response } from "@/lib/healperFunc";
import withdrawSchema from "@/models/withdrawSchema";
import Transactions from "@/models/transection";

export async function GET() {
  try {
    await connectDB();

    // Now User is registered, populate will work
    const withDraws = await withdrawSchema
      .find()
      .populate("userId", "name") // populate user info
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: withDraws,
    });
  } catch (err) {
    return catchError(err);
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const { userId, amount, method, phone, id } = await req.json();

    if (!userId || !amount || !method || !phone || !id) {
      return response(false, 400, "Missing required fields");
    }

    // 1. Create transaction
    const transaction = await Transactions.create({
      userId,
      type: "withdraw",
      method,
      phone,
      amount,
    });

    // 2. Delete withdraw request
    await withdrawSchema.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      data: transaction,
      message: "Withdraw approved and transaction recorded successfully",
    });
  } catch (err) {
    console.error("POST error:", err);
    return catchError(err);
  }
}
