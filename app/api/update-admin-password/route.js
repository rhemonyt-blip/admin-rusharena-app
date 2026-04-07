import { connectDB } from "@/lib/connectDB";
import { response } from "@/lib/healperFunc";
import Admin from "@/models/admins";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    let { id, password } = body;

    // 🔒 Validation
    if (!id) {
      return response(400, "Match type is required");
    }

    password = password?.trim();

    if (!password) {
      return response(400, "Password cannot be empty");
    }

    if (password.length < 4) {
      return response(400, "Password must be at least 4 characters");
    }

    // 🗑️ Delete existing record (if any)
    await Admin.deleteOne({ email: id });

    // 🆕 Create new record (always new _id)
    const newUser = await Admin.create({
      email: id,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return response(200, "Password updated successfully", newUser);
  } catch (error) {
    console.error("Update Password Error:", error);
    return response(500, "Internal Server Error");
  }
}
