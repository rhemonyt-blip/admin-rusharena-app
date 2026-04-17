"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
  MatchType1Img,
  MatchType2Img,
  MatchType3Img,
  MatchType4Img,
  MatchType5Img,
  MatchType6Img,
  MatchType7Img,
  MatchType8Img,
  MatchType9Img,
  MatchType10Img,
} from "@/config";
import PrizePopup from "@/app/component/application/prizePopup";
import { showToast } from "@/app/component/application/tostify";
import { set } from "mongoose";

// ✅ helper to get image based on type
const getMatchImage = (matchType) => {
  switch (matchType) {
    case MatchType1:
      return MatchType1Img;
    case MatchType2:
      return MatchType2Img;
    case MatchType3:
      return MatchType3Img;
    case MatchType4:
      return MatchType4Img;
    case MatchType5:
      return MatchType5Img;
    case MatchType6:
      return MatchType6Img;
    case MatchType7:
      return MatchType7Img;
    case MatchType8:
      return MatchType8Img;
    case MatchType9:
      return MatchType9Img;
    case MatchType10:
      return MatchType10Img;
    default:
      return "/images/logo.jpg";
  }
};

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const matchType = searchParams.get("type");
  if (!matchType) router.push("/match-results");

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [totalPrize, setTotalPrize] = useState(0);
  const [perKill, setPerKill] = useState(0);
  const [allPrize, setAllPrize] = useState([]);

  // ✅ Format time properly
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ✅ Fetch matches
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/matchResults?type=${encodeURIComponent(matchType)}`,
        );
        if (!res.ok) throw new Error("No matches found!");

        const data = await res.json();
        const allMatches = data?.data || [];

        const filtered = allMatches
          .filter((m) => m.matchType === matchType)
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        setMatches(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // ✅ Handle navigation
  const handleCardClick = (id) => {
    router.push(`/match-results/details?matchId=${id}`);
  };

  // ✅ Handle popup
  const handlePopup = (totalPrize, perKill, allPrize) => {
    setShowPopup(true);
    setTotalPrize(totalPrize);
    setPerKill(perKill);
    setAllPrize(allPrize);
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // ✅ No matches
  if (!matches.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-800 text-white p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">
          No Matches Found
        </h1>
        <p className="text-lg text-center">
          Sorry, there are no matches available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-black min-h-screen p-4 sm:flex sm:flex-col gap-4">
      <div className="flex items-center justify-around">
        <h1 className="text-center text-2xl text-fuchsia-50 font-bold mb-6">
          Today Matches
        </h1>
      </div>
      <div className="grid md:grid-cols-2 gap-3  ">
        {/* ✅ Available Matches */}
        {matches.map((match) => {
          return (
            <Card
              key={match._id}
              className="text-green-300 bg-green-900/20 border border-green-800 sm:w-full hover:bg-green-900/30 transition cursor-pointer"
              onClick={() => handleCardClick(match._id)}
            >
              <CardHeader>
                <div className="flex gap-4 justify-start">
                  <div className="w-16 h-16 min-w-16 rounded-full overflow-hidden relative">
                    <Image
                      src={getMatchImage(match.matchType)}
                      alt={match.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardTitle className="flex flex-col justify-center gap-1">
                    <strong>{match.title}</strong>
                    <p className="text-sm text-gray-300">
                      {formatDate(match.startTime)}
                    </p>
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* ✅ Prize Info */}
                <div className="flex justify-around">
                  <div className="text-green-500 font-bold flex flex-col items-center">
                    <strong>+ WIN PRIZE</strong>
                    <span>{match.winPrize} TK</span>
                  </div>
                  <div className="text-blue-500 font-bold flex flex-col items-center">
                    <strong>+ PER KILL</strong>
                    <span>{match.perKill} TK</span>
                  </div>
                  <div className="text-red-500 font-bold flex flex-col items-center">
                    <strong>ENTRY FEE</strong>
                    <span>{match.entryFee} TK</span>
                  </div>
                </div>

                <div className="flex justify-between text-gray-300 mt-2">
                  <div className="flex flex-col items-center w-full">
                    <strong>ENTRY TYPE</strong>
                    <span>{match.entryType}</span>
                  </div>
                  <div className="flex flex-col items-center border-x-4 border-amber-600 w-full">
                    <strong>MAP</strong>
                    <span>{match.map}</span>
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <strong>VERSION</strong>
                    <span>MOBILE</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3 mt-3">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePopup(
                        match.winPrize,
                        match.perKill,
                        match.prizeDetails,
                      );
                    }}
                    variant="outline"
                    className="border-gray-600 text-black"
                  >
                    Total Prize Details
                  </Button>

                  <strong className="w-1/3 p-2 bg-green-400 text-black rounded text-center font-bold">
                    {match.joinedPlayers
                      .map((e) => e.winning)
                      .reduce((a, b) => a + b, 0)}{" "}
                    TK
                  </strong>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {showPopup && (
          <PrizePopup
            totalPrize={totalPrize}
            perKill={perKill}
            allPrize={allPrize}
            onClose={() => setShowPopup(false)}
          />
        )}
      </div>
    </div>
  );
}
