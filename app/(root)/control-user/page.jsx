"use client";

import { useState } from "react";
import axios from "axios";
import { showToast } from "@/app/component/application/tostify";

export default function AdminUserControl() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [tokenFinding, setTokenFinding] = useState(null);
  const [banUserId, setBanUserId] = useState(null);
  const [banLoading, setBanLoading] = useState(false);

  // Fetch users by search
  const fetchUsers = async () => {
    if (!searchTerm.trim()) {
      showToast("error", "Enter username");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`/api/users?search=${searchTerm}`);
      if (res.data.success) {
        setUsers(res.data.data || []);
      } else {
        setUsers([]);
        showToast("error", res.data.message);
      }
    } catch (err) {
      showToast("error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (userId, field, value) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, [field]: Number(value) } : user,
      ),
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("info", "Copied to clipboard");
  };

  const updateBalance = async (userId, winbalance, dipositbalance) => {
    try {
      setUpdatingId(userId);
      const res = await axios.put("/api/users", {
        userId,
        winbalance,
        dipositbalance,
      });

      if (res.data.success) {
        showToast("success", "Balance updated");
      } else {
        showToast("error", res.data.message);
      }
    } catch {
      showToast("error", "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTokenCopy = async (userId) => {
    try {
      setTokenFinding(userId);
      const res = await axios.post("/api/get-admintoken", { userId });
      if (res.data.success) {
        navigator.clipboard.writeText(res.data.data.token);
        showToast("success", "Admin token copied");
      }
    } catch {
      showToast("error", "Failed to get token");
    } finally {
      setTokenFinding(null);
    }
  };

  const confirmBan = async (email) => {
    try {
      setBanLoading(true);
      const res = await axios.post("/api/ban-user", {
        userId: banUserId,
        email, // send email from frontend
      });

      if (res.data.success) {
        showToast("success", "User tokens banned successfully");
        setUsers((prev) => prev.filter((u) => u._id !== banUserId));
      } else {
        showToast("error", res.data.message);
      }
    } catch {
      showToast("error", "Failed to ban user");
    } finally {
      setBanLoading(false);
      setBanUserId(null);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#0f0f0f] text-gray-200">
      <h1 className="text-2xl font-semibold mb-8">Admin User Control</h1>

      {/* Search */}
      <div className="flex justify-center mb-10 gap-3">
        <input
          type="text"
          placeholder="Search username.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
          className="w-full md:w-[420px] bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={fetchUsers}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
        >
          Search
        </button>
      </div>

      {loading && (
        <p className="text-center text-gray-400">Searching users...</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-gradient-to-br from-[#1c1c1c] to-[#111] border border-gray-800 rounded-xl p-5 shadow-lg hover:border-blue-500 transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">{user.name}</h2>
              <button
                onClick={() => handleTokenCopy(user._id)}
                className="text-xs bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
              >
                {tokenFinding === user._id ? "Finding..." : "Copy Token"}
              </button>
            </div>

            {/* User Info */}
            {[
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone },
              { label: "Password", value: user.password },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center border-b border-gray-800 py-2"
              >
                <div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm break-all">{item.value || "N/A"}</p>
                </div>
                {item.value && (
                  <button
                    onClick={() => copyToClipboard(item.value)}
                    className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                  >
                    Copy
                  </button>
                )}
              </div>
            ))}

            {/* Balance Inputs */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="text-xs text-gray-400">Win Balance</label>
                <input
                  type="number"
                  value={user.winbalance ?? ""}
                  onChange={(e) =>
                    handleInputChange(user._id, "winbalance", e.target.value)
                  }
                  className="w-full mt-1 bg-[#1a1a1a] border border-gray-700 rounded p-2"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Deposit Balance</label>
                <input
                  type="number"
                  value={user.dipositbalance ?? ""}
                  onChange={(e) =>
                    handleInputChange(
                      user._id,
                      "dipositbalance",
                      e.target.value,
                    )
                  }
                  className="w-full mt-1 bg-[#1a1a1a] border border-gray-700 rounded p-2"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={() =>
                updateBalance(user._id, user.winbalance, user.dipositbalance)
              }
              disabled={updatingId === user._id}
              className={`mt-5 w-full py-2 rounded font-medium ${
                updatingId === user._id
                  ? "bg-gray-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {updatingId === user._id ? "Updating..." : "Save Changes"}
            </button>

            {/* Danger Zone */}
            <div className="mt-5 border-t border-red-800 pt-3">
              <p className="text-xs text-red-400 mb-2">Danger Zone</p>
              <button
                onClick={() => setBanUserId(user._id)}
                className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-sm"
              >
                Ban User
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ban Confirmation Modal */}
      {banUserId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 w-[350px]">
            <h2 className="text-lg font-semibold mb-3 text-white">
              Confirm Ban
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to ban this user?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setBanUserId(null)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  confirmBan(users.find((u) => u._id === banUserId)?.email)
                }
                disabled={banLoading}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded"
              >
                {banLoading ? "Banning..." : "Confirm Ban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
