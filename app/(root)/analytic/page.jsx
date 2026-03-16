"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { showToast } from "@/app/component/application/tostify";

export default function ContactPage() {
  const [messages, setMessages] = useState();
  const [input, setInput] = useState("");

  const [customText, setCustomText] = useState("");

  const [adminToken, setAdminToken] = useState(""); // new state for admin token

  const fetchMsg = async () => {
    try {
      const res = await axios.get(`/api/massage`, {
        params: { type: "msg" },
      });

      if (res?.data?.msg) {
        setMessages(res.data.msg);
      }
    } catch (err) {
      console.error("Error fetching marquee message:", err);
    }
  };

  useEffect(() => {
    fetchMsg();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await axios.post(`/api/updateNumber`, {
        number: input,
        type: "msg",
      });
      if (res.data.success) {
        setInput("");
        fetchMsg();
        showToast("success", "Message Updated");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();

    const finalMessage = `${customText} `.trim();

    if (!finalMessage) return;

    try {
      const res = await axios.post(`/api/send-notification`, {
        message: finalMessage,
      });

      if (res.data.success) {
        setCustomText("");
        showToast("success", "Notification request sent!");
      }
    } catch (error) {
      console.log("Notification error:", error);
    }
  };

  const handleAdminTokenSubmit = async (e) => {
    e.preventDefault();
    if (!adminToken.trim()) return;

    try {
      const res = await axios.post(`/api/seve-admintoken`, {
        token: adminToken,
      });

      if (res.data.success) {
        setAdminToken("");
        showToast("success", "Admin token saved successfully!");
      }
    } catch (error) {
      console.log("Admin token error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-900 text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!messages ? (
          <p className="text-gray-400 text-center">No messages yet</p>
        ) : (
          <div className="p-3 rounded-xl max-w-full bg-green-600 self-end">
            {messages}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 bg-gray-800 border-t border-gray-700 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="w-full mb-4 p-2 rounded-lg bg-gray-700 text-white outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 w-full bg-blue-600 rounded-lg hover:bg-blue-500"
        >
          Save Message
        </button>
      </form>

      <div className="w-full text-2xl items-center justify-center text-center my-4">
        <h2>Send Notification</h2>
      </div>

      <form
        onSubmit={handleNotificationSubmit}
        className="p-4 bg-gray-800 border-t border-gray-700 items-center"
      >
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Match Name"
          className="w-full mb-4 p-2 rounded-lg bg-gray-700 text-white outline-none"
        />

        <button
          type="submit"
          className="px-4 py-2 w-full bg-purple-600 rounded-lg hover:bg-purple-500"
        >
          Send Notification
        </button>
      </form>

      {/* New Admin Token Form */}
      <div className="w-full text-2xl items-center justify-center text-center mt-80 my-4">
        <h2>Save Admin Token</h2>
      </div>

      <form
        onSubmit={handleAdminTokenSubmit}
        className="p-4 bg-gray-800 border-t border-gray-700 mb-20 items-center"
      >
        <input
          type="text"
          value={adminToken}
          onChange={(e) => setAdminToken(e.target.value)}
          placeholder="Enter Admin Token"
          className="w-full mb-4 p-2 rounded-lg bg-gray-700 text-white outline-none"
        />

        <button
          type="submit"
          className="px-4 py-2 w-full bg-yellow-600 rounded-lg hover:bg-yellow-500"
        >
          Save Admin Token
        </button>
      </form>
    </div>
  );
}
