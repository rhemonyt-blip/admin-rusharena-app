"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "@/app/component/application/tostify";
import ButtonLoading from "@/app/component/buttonLoading";

export default function WithdrawListPage() {
  const [withdraws, setWithdraws] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]); // Track loading per withdraw
  const [copiedId, setCopiedId] = useState(null); // store which trxId was copied

  // Fetch all withdraw requests
  const fetchWithdraws = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_WEB_URL}api/withdraw`
      );
      if (data.success) {
        setWithdraws(data.data);
      } else {
        showToast("error", data.message || "Failed to load withdraws");
      }
    } catch {
      showToast("error", "Failed to fetch withdraws");
    }
  };

  useEffect(() => {
    fetchWithdraws();
  }, []);

  // Approve withdraw
  const handleApprove = async (userId, amount, method, phone, id) => {
    try {
      setLoadingIds((prev) => [...prev, id]); // mark this withdraw as loading
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEB_URL}api/withdraw`,
        { userId, amount, method, phone, id }
      );

      if (res.data.success) {
        showToast("success", "Withdraw approved successfully");
        setWithdraws((prev) => prev.filter((d) => d._id !== id));
      } else {
        showToast("error", res.data.message || "Approval failed");
      }
    } catch {
      showToast("error", "Failed to approve withdraw");
    } finally {
      setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id)); // remove loading
    }
  };

  // Copy phone/trxId
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-xl font-bold text-center mb-6">
        All Withdraw Requests
      </h1>

      {withdraws.length === 0 ? (
        <p className="text-gray-400 text-center">No pending withdraws found.</p>
      ) : (
        <div className="space-y-4">
          {withdraws.map((withdraw) => (
            <div
              key={withdraw._id}
              className="bg-[#5d5656] border border-gray-800 p-4 rounded-lg flex items-center justify-between"
            >
              <div className="space-y-1">
                <p>
                  <span className="text-gray-400">User Name:</span>{" "}
                  {withdraw.userId.name}
                </p>
                <p>
                  <span className="text-gray-400">Method:</span>{" "}
                  {withdraw.method}
                </p>
                <p>
                  <span className="text-gray-400">Amount:</span>{" "}
                  {withdraw.amount}
                </p>

                <p className="flex items-center space-x-2">
                  <span className="text-gray-400">Phone:</span>
                  <span>{withdraw.phone}</span>
                  <button
                    onClick={() => handleCopy(withdraw.phone, withdraw._id)}
                    className="ml-2 bg-gray-700 hover:bg-blue-500 px-2 py-1 rounded text-sm"
                  >
                    {copiedId === withdraw._id ? "Copied!" : "Copy"}
                  </button>
                </p>

                <p>
                  <span className="text-gray-400">Time:</span>{" "}
                  {new Date(withdraw.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </p>
              </div>

              <div className="mt-4 sm:mt-0">
                <ButtonLoading
                  loading={loadingIds.includes(withdraw._id)} // only this button shows loading
                  text="Complete"
                  disabled={loadingIds.includes(withdraw._id)}
                  onclick={() =>
                    handleApprove(
                      withdraw.userId._id,
                      withdraw.amount,
                      withdraw.method,
                      withdraw.phone,
                      withdraw._id
                    )
                  }
                  className="bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
