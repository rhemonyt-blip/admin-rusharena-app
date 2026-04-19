import { connectDB } from "@/lib/connectDB";
import { response } from "@/lib/healperFunc";
import Admin from "@/models/admins";

// 🔥 helper: HH:mm → minutes
const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    let { id, password, startTime, endTime, email } = body;

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

    if (!startTime || !endTime) {
      return response(400, "Start and End time required");
    }

    if (!email || !email.endsWith("@gmail.com")) {
      return response(400, "Valid Gmail required");
    }

    // ⏰ convert time
    const start = toMinutes(startTime);
    const end = toMinutes(endTime);

    if (start >= end) {
      return response(400, "End time must be greater than start time");
    }

    // 🆕 Create new record
    const newUser = await Admin.create({
      email,
      password,
      matchType: id,
      startTime: start,
      endTime: end,
    });

    if (!newUser) {
      return response(500, "Failed to update password");
    }
    return response(200, "Password updated successfully", newUser);
  } catch (error) {
    console.error("Update Password Error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
