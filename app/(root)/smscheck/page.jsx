"use client";

import { useState } from "react";

export default function XGSPage() {
  const [responseMsg, setResponseMsg] = useState("");

  const handleClick = async () => {
    try {
      const res = await fetch("/api/diposit/autoAdd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "You have received Tk 5.00 from 01941340960. Ref 0. Fee Tk 0.00. Balance Tk 5.00. TrxID CKC9540PGJ at 12/11/2025 06:59 ",
        }),
      });

      const data = await res.json();
      setResponseMsg(data.message);
    } catch (error) {
      console.error("Error:", error);
      setResponseMsg("Request failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">XGS Page</h1>
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg transition"
      >
        Send POST Request
      </button>

      {responseMsg && <p className="mt-4 text-green-400">{responseMsg}</p>}
    </div>
  );
}
