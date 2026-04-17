import { connectDB } from "@/lib/connectDB";
import ResultMatches from "@/models/resultMatch";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const matchType = searchParams.get("matchType");

    if (!matchType) {
      return NextResponse.json(
        { success: false, message: "matchType is required" },
        { status: 400 }
      );
    }

    // ✅ Delete all matches with this matchType
    const deleted = await ResultMatches.deleteMany({ matchType });

    return NextResponse.json({
      success: true,
      message: `${deleted.deletedCount} matches deleted successfully`,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}