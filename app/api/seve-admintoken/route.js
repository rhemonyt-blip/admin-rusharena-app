import { connectDB } from "@/lib/connectDB";
import adminTokens from "@/models/adminTokens";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Token and userId are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDB();

    //  here check if token exists, if yes update else create new
    const result = await adminTokens.findOneAndUpdate(
      { token },
      { token },
      { upsert: true, new: true }
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Token saved/updated successfully",
        data: result,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error saving token:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
