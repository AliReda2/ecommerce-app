"use client";
import { Button } from "@/components/ui/button";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Page = () => {
  const handleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google/login`;
  };

  return <Button onClick={handleLogin}>Login with Google</Button>;
};

export default Page;
