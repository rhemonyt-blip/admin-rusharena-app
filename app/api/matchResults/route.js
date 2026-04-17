import { connectDB } from "@/lib/connectDB";
import ResultMatches from "@/models/resultMatch";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const matchType = searchParams.get("type");

    if (!matchType) {
      return new Response(
        JSON.stringify({ message: "Match type is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Fetch matches that match matchType AND have startTime within today
    const matches = await ResultMatches.find({
      matchType,
      // startTime: { $gte: startOfDay, $lte: endOfDay },
    }).lean();

    if (!matches || matches.length === 0) {
      return new Response(
        JSON.stringify({ message: "No matches found", data: [] }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ message: "Success", data: matches }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to fetch matches",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
