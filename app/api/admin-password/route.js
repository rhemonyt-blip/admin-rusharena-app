import { connectDB } from "@/lib/connectDB";
import { response } from "@/lib/healperFunc";
import Admin from "@/models/admins";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const authId = searchParams.get("authId");
    const matchType = searchParams.get("matchType");

    if (!authId) {
      return response(false, 401, "Unauthorized User!");
    }

    // 🔐 Extract token (your logic)
    const token = authId.slice(6);

    // ✅ Proper auth check
    const authUser = await Admin.findOne({ password: token }).lean();

    // if (!authUser) {
    //   return response(false, 401, "Unauthorized User!");
    // }

    // 🔍 Build query dynamically
    const query = matchType && matchType !== "allMatches" ? { matchType } : {};

    // 📦 Fetch data (only required fields)

    const matches = await Admin.find(query)
      .select("_id matchType email password startTime endTime")
      .lean();

    return new Response(
      JSON.stringify({
        message: "Success",
        data: matches,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("API error:", error);

    return new Response(
      JSON.stringify({
        message: "Failed to fetch data",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
