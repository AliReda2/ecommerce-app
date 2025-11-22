"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import toast from "react-hot-toast";
import {
  login,
  register,
  resendOtp,
  verifyOtp,
} from "@/lib/features/authSlice";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import posthog from "posthog-js";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const [mode, setMode] = useState<"login" | "register" | "verify">("login");

  const dispatch = useDispatch<AppDispatch>();
  const { isRegistering, isLoggingIn, isVerifyingOtp } = useSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState("");

  // -------------------------
  // LOGIN STATE + HANDLERS
  // -------------------------
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google/login`;
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await dispatch(
      login({
        email: loginData.email,
        password: loginData.password,
      })
    )
      .unwrap()
      .then((data) => {
        toast.success("Logged in successfully");

        // Identify the user in PostHog
        posthog.identify(data.user.id, {
          email: data.user.email,
          fullName: data.user.fullName,
          role: data.user.role,
        });

        onClose(); // close modal after success
      })
      .catch((error) => toast.error(error));
  };

  const [showPassword, setShowPassword] = useState(false);

  // -------------------------
  // REGISTER STATE + HANDLERS
  // -------------------------
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    await dispatch(
      register({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Account created successfully");
        setEmail(registerData.email); // <-- SAVE EMAIL HERE
        setMode("verify"); // <-- Switch to verify
        setOtpExpiresIn(600); // reset OTP validity
        onClose(); // close modal after success
      })
      .catch((error) => toast.error(error));
  };

  const [otp, setOtp] = useState("");

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email)
      await dispatch(verifyOtp({ email, otp }))
        .unwrap()
        .then(() => {
          toast.success("OTP verified successfully");
          onClose(); // close modal after success
        })
        .catch((error) => toast.error(error));
    onClose();
  };

  const handleResendOtp = () => {
    dispatch(resendOtp({ email }))
      .unwrap()
      .then(() => {
        toast.success("OTP sent");
        setResendCooldown(90); // start cooldown again
        setOtpExpiresIn(600); // new OTP validity
      })
      .catch((error) => toast.error(error));
  };

  const [resendCooldown, setResendCooldown] = useState(0); // seconds
  const [otpExpiresIn, setOtpExpiresIn] = useState(600); // 10 minutes

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    if (otpExpiresIn <= 0) return;

    const interval = setInterval(() => {
      setOtpExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [otpExpiresIn]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            {mode}
          </DialogTitle>
        </DialogHeader>
        {/* Switcher */}
        <div className="flex justify-center gap-4 mt-2 mb-4">
          <button
            onClick={() => setMode("login")}
            className={`pb-1 text-sm font-medium ${
              mode === "login"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`pb-1 text-sm font-medium ${
              mode === "register"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setMode("verify")}
            className={`pb-1 text-sm font-medium ${
              mode === "verify"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Verify
          </button>
        </div>
        {(mode === "login" || mode === "register") && (
          <div className="grid">
            <Button
              onClick={handleGoogleLogin}
              className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                  fill="#4285F4"
                />
                <path
                  d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                  fill="#34A853"
                />
                <path
                  d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                  fill="#FBBC05"
                />
                <path
                  d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                  fill="#EB4335"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>
        )}
        {/* LOGIN FORM */}
        {mode === "login" && (
          <form className="space-y-6 mt-6" onSubmit={handleLogin}>
            <div>
              <Label>Email</Label>
              <Input
                className="mt-1"
                placeholder="info@gmail.com"
                id="email"
                type="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  id="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <Link href="/forgot-password" onClick={() => onClose()}>
              Forgot Password?
            </Link>

            <br />
            <br />
            <Button className="w-full" size="sm" disabled={isLoggingIn}>
              {isLoggingIn ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        )}
        {/* REGISTER FORM */}
        {mode === "register" && (
          <form className="space-y-6 mt-6" onSubmit={handleRegister}>
            <div>
              <Label>First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={registerData.firstName}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={registerData.lastName}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="info@gmail.com"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <div>
              <Label>Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <Button className="w-full" size="sm" disabled={isRegistering}>
              {isRegistering ? "Creating account..." : "Register"}
            </Button>
          </form>
        )}

        {mode === "verify" && (
          <div>
            {/* RESEND + TIMER */}
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className="text-sm"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend OTP"}
              </Button>

              <span className="text-xs text-gray-500">
                OTP expires in {otpExpiresIn}s
              </span>
            </div>

            <form className="space-y-6 mt-6" onSubmit={handleVerifyOtp}>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@email.com"
                />
              </div>

              <div>
                <Label>Enter OTP sent to {email}</Label>
                <Input
                  className="mt-1 text-center tracking-widest"
                  placeholder="123456"
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  required
                />
              </div>

              <Button className="w-full" size="sm" disabled={isVerifyingOtp}>
                {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
