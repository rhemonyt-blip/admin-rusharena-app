"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Preferences } from "@capacitor/preferences";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { value } = await Preferences.get({ key: "access_hc" });
        if (!value) {
          router.replace("/login"); // Redirect if not logged in
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    }
    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
}
