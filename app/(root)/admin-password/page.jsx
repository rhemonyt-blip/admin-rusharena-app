"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Copy } from "lucide-react";
import { showToast } from "@/app/component/application/tostify";
import { Preferences } from "@capacitor/preferences";

import {
  MatchType1,
  MatchType2,
  MatchType3,
  MatchType4,
  MatchType5,
  MatchType6,
  MatchType7,
  MatchType8,
  MatchType9,
  MatchType10,
} from "@/config";

// 🔹 Reusable Password Field
function PasswordField({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        className="w-full px-3 py-2 pr-10 rounded bg-gray-700 border border-gray-600"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export default function MatchAccessPage() {
  const [matches, setMatches] = useState([]);
  const [visible, setVisible] = useState({});
  const [loading, setLoading] = useState(false);

  const [selectedMatch, setSelectedMatch] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 🔥 Fetch Matches
  const loadMatches = async () => {
    try {
      const { value } = await Preferences.get({ key: "access_token" });

      if (!value) {
        return showToast("error", "Please login first");
      }

      const { data } = await axios.get(
        `/api/admin-password?authId=${encodeURIComponent(value)}`,
      );

      setMatches(data?.data || []);
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to load data");
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  // 👁 Toggle password visibility
  const toggle = (id) => {
    setVisible((p) => ({ ...p, [id]: !p[id] }));
  };

  // 📋 Copy
  const copy = (text) => {
    navigator.clipboard.writeText(text);
    showToast("success", "Copied");
  };

  // 💾 Save
  const handleSave = async () => {
    if (!selectedMatch || !newPassword)
      return showToast("error", "All fields required");

    if (newPassword.length < 4) return showToast("error", "Password too short");

    try {
      setLoading(true);

      await axios.post("/api/update-admin-password", {
        id: selectedMatch,
        password: newPassword.trim(),
      });

      showToast("success", "Password updated");

      setSelectedMatch("");
      setNewPassword("");
      loadMatches();
    } catch (err) {
      console.error(err);
      showToast("error", "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Match Access Manager
      </h1>

      <div className="max-w-4xl mx-auto space-y-4">
        {/* 🔹 Match List */}
        {matches.map((m) => (
          <div key={m._id} className="bg-gray-800 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-orange-400 font-semibold">{m.email}</span>

              <button
                onClick={() => copy(m.password)}
                className="bg-gray-700 p-2 rounded hover:bg-gray-600"
              >
                <Copy size={16} />
              </button>
            </div>

            <div className="relative">
              <div className="bg-gray-700 px-3 py-2 rounded border border-gray-600">
                {visible[m._id] ? m.password : "••••••••••"}
              </div>

              <button
                onClick={() => toggle(m._id)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {visible[m._id] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        ))}

        {/* 🔹 Change Password */}
        <div className="bg-gray-800 p-4 rounded-xl mt-6">
          <h2 className="text-lg font-bold mb-4">Change Password</h2>

          <div className="space-y-3">
            {/* Select */}
            <select
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600"
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
            >
              <option value="">Choose a match</option>
              <option value="admin">Admin</option>
              {[
                MatchType1,
                MatchType2,
                MatchType3,
                MatchType4,
                MatchType5,
                MatchType6,
                MatchType7,
                MatchType8,
                MatchType9,
                MatchType10,
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Password */}
            <PasswordField
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />

            {/* Button */}
            <button
              onClick={handleSave}
              disabled={!selectedMatch || !newPassword || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Saving..." : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
