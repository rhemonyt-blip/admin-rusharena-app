import { connectDB } from "@/lib/connectDB";
import Tokens from "@/models/Tokens";

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "userId is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDB();

    const tokenDoc = await Tokens.findOne({ userId }).lean();

    if (!tokenDoc) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Admin token not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          token: tokenDoc.token,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error fetching admin token:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
