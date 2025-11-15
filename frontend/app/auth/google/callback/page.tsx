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
      router.replace("/login");
    }
  }, [router]);

  return <h3>Signing you in with Google...</h3>;
}
