"use client";

import { useState } from "react";
import { ChevronLeftIcon, EyeIcon, EyeCloseIcon } from "@/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AppDispatch, RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/lib/features/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignInForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const user = await dispatch(
        login({
          email: loginData.email,
          password: loginData.password,
        })
      ).unwrap();

      toast.success("Logged in successfully!");

      if (user.user.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch (err: any) {
      toast.error(err || "Failed to login");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>

          <form onSubmit={handleLogin}>
            <div className="space-y-6 mt-6">
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
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="#!"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>

              <Button className="w-full" size="sm" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm text-center text-gray-700 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/admin-auth/register"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
