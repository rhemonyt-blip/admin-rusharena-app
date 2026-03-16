"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  add_match,
  admin_add_tournament,
  all_deposit,
  all_withdraws,
  analytic,
  control_user,
  edit_number,
  match_result,
} from "@/routes/websiteRoute";
import ButtonLoading from "./buttonLoading";
import { Preferences } from "@capacitor/preferences";
import { showToast } from "./application/tostify";

import {
  Home,
  FilePlus,
  DollarSign,
  ArrowDownCircle,
  Settings,
  Edit,
} from "lucide-react";

// Menu Data
const menuData = [
  { label: "Control User", link: control_user, icon: FilePlus },
  { label: "Pending Diposits", link: all_deposit, icon: DollarSign },
  { label: "Pending withdraws", link: all_withdraws, icon: ArrowDownCircle },
  { label: "Others", link: analytic, icon: Settings },
  { label: "Edit Numbers", link: edit_number, icon: Edit },
];

export default function FullScreenMobileMenu() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      // Clear access token from Preferences
      await Preferences.remove({ key: "access_token" });

      // Clear cookie
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

      showToast("success", "Logged out successfully!");
      window.location.href = `${process.env.NEXT_PUBLIC_WEB_URL}/login`;
    } catch (error) {
      console.error("Error during logout:", error);
      showToast("error", "Failed to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-y-auto  py-6 ">
      {/* Header / Logo */}
      <div className="mb-6 bg-gray-800 p-4 rounded flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-600 underline">
          Dashbard
        </h1>
        <div className="">
          <ButtonLoading
            className="w-full rounded-full bg-red-600 hover:bg-red-700"
            onclick={handleLogout}
            text="Logout"
            loading={loading}
          />
        </div>
      </div>

      {/* Menu */}
      <nav className="space-y-3 p-4">
        {menuData.map((item, idx) =>
          item.subMenu ? (
            <Accordion key={idx} type="single" collapsible>
              <AccordionItem value={item.label}>
                <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 text-base font-medium bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{item.label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-10 space-y-2 pt-2">
                  {item.subMenu.map((sub, sidx) => (
                    <Link
                      key={sidx}
                      href={sub.link}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
                    >
                      {sub.icon && <sub.icon className="w-4 h-4" />}
                      <span>{sub.label}</span>
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <Link
              key={idx}
              href={item.link}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
            >
              {item.icon && <item.icon className="w-5 h-5" />}
              <span>{item.label}</span>
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
