"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Copy } from "lucide-react";
import { showToast } from "@/app/component/application/tostify";
import { Preferences } from "@capacitor/preferences";
import { Button } from "@/components/ui/button";

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

// 🔹 Password Field
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
      <Button
        type="Button"
        onClick={() => setShow((p) => !p)}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </Button>
    </div>
  );
}

export default function MatchAccessPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [selectedMatch, setSelectedMatch] = useState("");
  const [filterMatch, setFilterMatch] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [gmail, setGmail] = useState("");

  const matchTypes = [
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
  ];

  // 🔥 Fetch Matches
  const loadMatches = async () => {
    try {
      setFetching(true);

      const { value } = await Preferences.get({ key: "access_token" });

      if (!value) {
        return showToast("error", "Please login first");
      }

      const query = `/api/admin-password?authId=${encodeURIComponent(value)}${
        filterMatch ? `&matchType=${encodeURIComponent(filterMatch)}` : ""
      }`;

      const res = await axios.get(query);

      // ✅ SAFE CHECK
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];

      setMatches(list);
    } catch (err) {
      console.error(err);
      setMatches([]); // 🔥 fallback
      showToast("error", "Failed to load data");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [filterMatch]);

  const convertToTime = (totalMinutes) => {
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;

    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    minutes = minutes.toString().padStart(2, "0");

    return `${hours}:${minutes} ${ampm}`;
  };

  // 📋 Copy
  const copy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast("success", "Copied");
  };

  const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  // 💾 Save
  const handleSave = async () => {
    if (!selectedMatch || !newPassword || !startTime || !endTime || !gmail) {
      return showToast("error", "All fields required");
    }

    if (newPassword.length < 4) {
      return showToast("error", "Password too short");
    }

    if (!gmail.endsWith("@gmail.com")) {
      return showToast("error", "Enter valid Gmail");
    }

    if (toMinutes(startTime) >= toMinutes(endTime)) {
      return showToast("error", "End time must be greater");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "/api/admin-password/update-admin-password",
        {
          id: selectedMatch,
          password: newPassword.trim(),
          startTime,
          endTime,
          email: gmail,
        },
      );

      if (!res?.data?.success) {
        showToast("error", res?.data?.message || "Update failed");
        return;
      }
      showToast("success", "Updated");

      loadMatches();
    } catch (err) {
      showToast("error", "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Match (after confirmation)
  const deleteMatch = async (accessId) => {
    try {
      const res = await axios.post("/api/admin-password/delete-admin", {
        accessId,
      });
      if (res?.data.success) {
        setMatches((prev) => prev.filter((m) => m._id !== accessId));
        showToast("success", res.data.message || "Match deleted successfully");
      } else {
        showToast("error", res.data.message || "Failed to delete ");
      }
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Match Access Manager
      </h1>

      {/* 🔹 CHANGE PASSWORD */}
      <div className="max-w-4xl mx-auto bg-gray-800 p-4 rounded-xl my-16">
        <h2 className="text-lg font-bold mb-4">Create a new Access</h2>

        <div className="space-y-3">
          <select
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600"
          >
            <option value="">Choose match</option>
            <option value="admin">Admin</option>
            {matchTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="email"
            placeholder="Enter Gmail"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600"
          />

          <PasswordField
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
          />

          <div className="flex gap-3">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 py-2 rounded"
          >
            {loading ? "Saving..." : "Save Access"}
          </Button>
        </div>
      </div>
      {/* 🔥 FILTER */}
      <div className="max-w-4xl mx-auto mb-6 flex gap-4">
        <select
          value={filterMatch}
          onChange={(e) => setFilterMatch(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600"
        >
          <option value="allMatches">All Matches</option>
          <option value="admin">Admin</option>
          {matchTypes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <Button onClick={loadMatches} className="bg-gray-700 px-4 py-2 rounded">
          {fetching ? "Loading..." : "Fetch"}
        </Button>
      </div>

      {/* 🔹 MATCH LIST */}
      <div className="max-w-4xl mx-auto space-y-4">
        {matches.length === 0 && !fetching && (
          <div className="text-center text-gray-400">No matches found</div>
        )}
        {Array.isArray(matches) &&
          matches.map((m, index) => (
            <div
              key={m?._id || index}
              className="bg-gray-800 p-4 rounded-xl space-y-3"
            >
              <div className="flex justify-between">
                <span className="text-blue-400 font-semibold">
                  {m?.matchType || "N/A"}
                </span>

                <span className="text-sm text-gray-400">
                  Access Time:
                  <strong className="text-orange-400 mx-1">
                    {convertToTime(m?.startTime) || "--"} →{" "}
                    {convertToTime(m?.endTime) || "--"}
                  </strong>
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-orange-400">{m?.email || "N/A"}</span>
                <Button onClick={() => copy(m?.email)}>
                  <Copy size={16} />
                </Button>
                <Button
                  className="px-4 py-2 bg-red-600 rounded"
                  onClick={() => setConfirmDelete(m?._id)}
                >
                  {" "}
                  Delete
                </Button>
              </div>

              <div className="relative">
                <div className="bg-gray-700 px-3 py-2 rounded border border-gray-600">
                  {m?.password || "••••••••••••••••"}
                </div>

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-4">
                  <Button onClick={() => copy(m?.password)}>Copy</Button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* ✅ Delete Confirmation Popup */}
      {confirmDelete && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this match?
            </h2>
            <div className="flex justify-center gap-4 mt-4">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => deleteMatch(confirmDelete)}
              >
                Yes, Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => setConfirmDelete(null)}
                className="border-gray-400 text-gray-800"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
