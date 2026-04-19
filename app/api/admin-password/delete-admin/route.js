import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import Admin from "@/models/admins";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    let { accessId } = body;

    if (!accessId) {
      return NextResponse.json(
        { success: false, message: "accessId is required" },
        { status: 400 },
      );
    }

    const deletedMatch = await Admin.findByIdAndDelete(accessId);

    if (!deletedMatch) {
      return NextResponse.json(
        { success: false, message: "Failed to delete Admin Access" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "admin deleted and logged out successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
