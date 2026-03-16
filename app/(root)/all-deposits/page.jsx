"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "@/app/component/application/tostify";
import ButtonLoading from "@/app/component/buttonLoading";

export default function DepositListPage() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    trxId: "",
    phone: "",
  });

  // Fetch all deposit requests
  const fetchDeposits = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_WEB_URL}/api/diposit`,
      );
      if (data.success) {
        setDeposits(data.data);
      } else {
        showToast("error", data.message || "Failed to load deposits");
      }
    } catch {
      showToast("error", "Failed to fetch deposits");
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  // Copy trxId
  const handleCopy = (trxId, id) => {
    navigator.clipboard.writeText(trxId);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Open modal and set selected deposit info
  const openModal = (deposit) => {
    setSelectedDeposit(deposit);
    setFormData({
      amount: deposit.amount || "",
      trxId: deposit.trxId || "",
      phone: deposit.phone || "",
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit deposit receive request
  const handleReceive = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEB_URL}/api/diposit/receive`,
        {
          transactionId: formData.trxId,
          amount: Number(formData.amount),
          senderNumber: formData.phone,
          service: selectedDeposit?.method, // send payment method
        },
      );

      if (res.data.success) {
        showToast(
          "success",
          res.data.message || "Deposit received successfully",
        );
        setDeposits((prev) =>
          prev.filter((d) => d._id !== selectedDeposit._id),
        );
        setShowModal(false);
      } else {
        showToast("error", res.data.message || "Failed to receive deposit");
      }
    } catch {
      showToast("error", "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-xl font-bold text-center mb-6">
        All Deposit Requests
      </h1>

      {deposits.length === 0 ? (
        <p className="text-gray-400 text-center">No pending deposits found.</p>
      ) : (
        <div className="space-y-4">
          {deposits.map((deposit) => (
            <div
              key={deposit._id}
              className="bg-[#5d5656] border border-gray-800 p-4 rounded-lg flex items-center justify-between"
            >
              <div className="space-y-1">
                <p>
                  <span className="text-gray-400">Method:</span>{" "}
                  {deposit.method}
                </p>
                <p>
                  <span className="text-gray-400">Phone:</span> {deposit.phone}
                </p>
                <p className="flex items-center space-x-2">
                  <span className="text-gray-400">TrxID:</span>
                  <span>{deposit.trxId}</span>
                  <button
                    onClick={() => handleCopy(deposit.trxId, deposit._id)}
                    className="ml-2 bg-gray-700 hover:bg-blue-500 px-2 py-1 rounded text-sm"
                  >
                    {copiedId === deposit._id ? "Copied!" : "Copy"}
                  </button>
                </p>
                <p>
                  <span className="text-gray-400">Time:</span>{" "}
                  {new Date(deposit.createdAt).toLocaleString("en-US", {
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
                <button
                  onClick={() => openModal(deposit)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md relative">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Approve Deposit
            </h2>

            <form onSubmit={handleReceive} className="space-y-4">
              {/* Amount (editable) */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-900 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* TrxID (read-only) */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  TrxID
                </label>
                <input
                  type="text"
                  name="trxId"
                  value={formData.trxId}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-900 rounded border border-gray-700 text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Phone (read-only) */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-900 rounded border border-gray-700 text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <ButtonLoading
                  loading={loading}
                  text="Submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
