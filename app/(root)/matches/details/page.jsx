"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import ButtonLoading from "@/app/component/buttonLoading";
import { showToast } from "@/app/component/application/tostify";

export default function MatchDetails() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId");
  const router = useRouter();

  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/matches/details/?matchId=${matchId}`);
        setMatch(res.data.match);
        setPlayers(res.data.match.joinedPlayers || []);
      } catch (err) {
        console.error("Error fetching match data:", err);
      }
    };
    fetchData();
  }, [matchId]);

  const handleInputChange = (index, field, value) => {
    const updated = [...players];
    updated[index][field] = value;
    setPlayers(updated);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const results = players.map((player) => ({
        playerId: player.authId,
        kills: Number(player.kills) || 0,
        wining: Number(player.wining) || 0,
      }));

      const res = await axios.post(`/api/matches/updateResults`, {
        matchId,
        results,
      });

      if (res.data.success) {
        showToast("success", "Results saved successfully!");
        router.back();
      } else {
        showToast("error", "Failed to save results");
      }
    } catch (err) {
      console.error("Error saving results:", err);
      showToast("error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!match) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Match not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0620] text-white px-4 py-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Details Page</h2>
        <p className="text-xl font-bold mt-2">{match.matchTitle}</p>
      </div>

      {/* Players List */}
      <div className="mt-8 border-t border-gray-700 pt-4">
        <h3 className="font-bold text-lg mb-3 text-center">Joined Players</h3>
        {players.length > 0 ? (
          <div className="max-h-64 overflow-y-auto bg-gray-900 rounded-lg border border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="py-2 px-4 text-left">#</th>
                  <th className="py-2 px-4 text-left w-1/3 ">Player Name</th>
                  <th className="py-2 px-4 text-left">User Name</th>
                  <th className="py-2 px-4 text-left">Result</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={player._id} className="border-b border-gray-800">
                    <td className="py-2 px-4 w-1/12">{index + 1}</td>
                    <td className="py-2 px-4 w-1/4 ">{player.name}</td>
                    <td className="py-2 px-4 w-1/5 ">{player.userName}</td>
                    <td className="py-2 px-4 w-1/3 flex gap-3">
                      <input
                        type="number"
                        placeholder="Kill"
                        value={player.kills || ""}
                        onChange={(e) =>
                          handleInputChange(index, "kills", e.target.value)
                        }
                        className="border border-blue-600 bg-transparent py-1 px-2 w-28 rounded outline-none"
                      />

                      <input
                        type="number"
                        value={player.wining || ""}
                        placeholder="Win"
                        onChange={(e) =>
                          handleInputChange(index, "wining", e.target.value)
                        }
                        className="border border-blue-600 bg-transparent py-1 px-2 w-28 rounded outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400">No players joined yet.</p>
        )}
        {players.length > 0 && (
          <div className="mt-4">
            <ButtonLoading
              className="w-full bg-blue-600 hover:bg-blue-700"
              text="Save Results"
              onclick={handleSave}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
