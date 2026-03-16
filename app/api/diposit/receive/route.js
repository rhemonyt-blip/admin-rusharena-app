import { connectDB } from "@/lib/connectDB";
import DepositSchema from "@/models/dipositScema";
import SmsLog from "@/models/smsLog";
import Transactions from "@/models/transection";
import User from "@/models/user";

export async function POST(req) {
  try {
    await connectDB();

    const { transactionId, amount, senderNumber, service } = await req.json();

    // --- Validate input ---
    if (!transactionId || !amount || !senderNumber || !service) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // --- Find matching deposit ---
    const deposit = await DepositSchema.findOne({ trxId: transactionId });

    if (!deposit) {
      return Response.json({
        success: true,
        message: "SMS logged — no matching deposit found yet",
      });
    }

    // --- Validate amount ---
    const numericAmount = Number(amount || deposit.amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return Response.json(
        { success: false, message: "Invalid or missing amount value" },
        { status: 400 }
      );
    }

    // --- Update user's deposit balance safely ---
    const updatedUser = await User.findByIdAndUpdate(
      deposit.userId,
      { $inc: { dipositbalance: numericAmount } },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "User not found for this deposit" },
        { status: 404 }
      );
    }

    // --- Create transaction record ---
    await Transactions.create({
      userId: deposit.userId,
      type: "deposit",
      method: service,
      phone: senderNumber,
      amount: numericAmount,
      createdAt: new Date(),
    });

    // --- Delete matched deposit ---
    await DepositSchema.deleteOne({ trxId: transactionId });

    // --- Success ---
    return Response.json({
      success: true,
      message: "Deposit matched and balance credited successfully",
      updatedUser,
    });
  } catch (err) {
    console.error("SMS receive error:", err);
    return Response.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
