"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    console.log("Received accessToken:", accessToken);
    console.log("Received refreshToken:", refreshToken);

    if (accessToken && refreshToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      router.replace("/");
    } else {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* Animated Bouncing Dots */}
      <div className="flex space-x-2 mb-4">
        <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></span>
        <span className="w-4 h-4 bg-blue-400 rounded-full animate-bounce animation-delay-200"></span>
        <span className="w-4 h-4 bg-blue-300 rounded-full animate-bounce animation-delay-400"></span>
      </div>
      <p className="text-lg font-medium">Signing you in with Google...</p>
    </div>
  );
}
