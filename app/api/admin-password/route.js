import { connectDB } from "@/lib/connectDB";
import { response } from "@/lib/healperFunc";
import Admin from "@/models/admins";
import User from "@/models/admins";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const authId = searchParams.get("authId");

    if (!authId) {
      return response(false, 400, "Unauthorized User!");
    }

    const slicedcoocie = authId.slice(6);
    // Fetch user by ID
    const authUser = await Admin.find({ password: slicedcoocie }).lean();

    if (!authUser) {
      return response(false, 404, " Unauthorized User!");
    }

    const matches = await Admin.find().lean();
    if (!matches) {
      return response(false, 404, " No Matches Password found!");
    }

    return new Response(JSON.stringify({ message: "Success", data: matches }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to fetch authUser",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
