import { connectDB } from "@/lib/connectDB";
import Transactions from "@/models/transection";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: "User ID is required" }),
        { status: 400 }
      );
    }

    const transactions = await Transactions.find({ userId }).sort({
      createdAt: -1,
    });

    if (!transactions.length) {
      return new Response(
        JSON.stringify({ success: false, message: "No transactions found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: transactions.length,
        transactions,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
