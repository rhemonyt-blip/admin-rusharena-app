"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { Preferences } from "@capacitor/preferences";

import { showToast } from "./tostify";

export default function Navbar() {
  const [BalanceAmount, setbalance] = useState(0);

  useEffect(() => {
    async function loadUser() {
      try {
        const { value } = await Preferences.get({ key: "access_token" });

        if (!value) {
          showToast("error", "Please login to continue!");
          return;
        }

        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_WEB_URL
          }api/getuser?authId=${encodeURIComponent(value)}`
        );

        const data = await res.json();
        setbalance(data.data.dipositbalance + data.data.winbalance);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }

    loadUser();
  }, []);
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 min-h-[38px] bg-[#0A0020] flex justify-between py-3 px-6 shadow-[0_-1px_10px_rgba(0,0,0,0.4)] z-99">
        {/* Left side: Logo and company name */}
        <div className="flex items-center space-x-2">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={52}
            height={52}
            className="rounded-full"
          />
          <h1 className="text-xl font-black text-yellow-400 uppercase tracking-tighter drop-shadow-[2px_2px_0_#000]">
            Rush Arena
          </h1>
        </div>

        {/* Right side: Profile section */}
        <div className="flex items-center ">
          <Image
            src="/images/assets/wallet.jpg"
            alt="wallet"
            width={56}
            height={56}
            className="rounded w-[56px] h-[56px] object-cover"
          />
          <span className="font-medium text-white">
            ৳ {isNaN(Number(BalanceAmount)) ? 0 : Number(BalanceAmount)}
          </span>
        </div>
      </nav>
    </>
  );
}
