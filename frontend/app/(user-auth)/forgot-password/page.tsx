"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { forgotPassword } from "@/lib/features/authSlice";
import useGoBack from "@/hooks/useGoBack";

export default function ForgotPasswordPage() {
  const goBack = useGoBack();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isSendingOtp } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(forgotPassword({ email }))
      .unwrap()
      .then(() => {
        toast.success("OTP sent to your email");
        router.push(`/reset-password?email=${email}`);
      })
      .catch((error) => toast.error(error));
  };

  return (
    <div className="max-w-md mx-auto mt-20 space-y-6">
      <div
        className="w-full flex
      "
      >
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-gray-700 mb-6 hover:text-gray-900 transition hover:cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          <span className="font-medium">Back</span>
        </button>
      </div>
      <h1 className="text-2xl font-semibold">Forgot Password</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="mb-1">Email</Label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button className="w-full" disabled={isSendingOtp}>
          {isSendingOtp ? "Sending..." : "Send OTP"}
        </Button>
      </form>
    </div>
  );
}
