"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "@/lib/features/authSlice";
import type { RootState, AppDispatch } from "@/lib/store";

import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";

import { showSuccess, showError } from "@/lib/alert";
import HeroSidePanel from "@/components/HeroSidePanel";

export default function AuthPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.id]: e.target.value });
  };
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("[login/page] dispatching login", { email: loginData.email });
      const result = await dispatch(
        login({ email: loginData.email, password: loginData.password })
      ).unwrap();
      console.log("[login/page] login fulfilled", result);

      showSuccess("Logged in successfully!");

      // Redirect based on role (hard redirect to avoid client-side guard race)
      if (result.user.role === "ADMIN") {
        console.log("[login/page] redirecting to /admin (hard)");
        if (typeof window !== "undefined") window.location.assign("/admin");
      } else {
        console.log("[login/page] redirecting to / (hard)");
        if (typeof window !== "undefined") window.location.assign("/");
      }
    } catch (err: any) {
      console.error("[login/page] login rejected", err);
      showError(err || "Failed to login");
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      showError("Passwords do not match");
      return;
    }
    try {
      await dispatch(
        register({
          email: registerData.email,
          password: registerData.password,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
        })
      ).unwrap();
      showSuccess("Registered successfully!");
      router.replace("/");
    } catch (err: any) {
      showError(err || "Failed to register");
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <HeroSidePanel />
      <div className="flex items-center justify-center">
        <LoginForm
          email={loginData.email}
          password={loginData.password}
          isLoading={isLoading}
          onChange={handleLoginChange}
          onSubmit={handleLogin}
        />
      </div>
      <div className="flex items-center justify-center">
        <RegisterForm
          email={registerData.email}
          password={registerData.password}
          confirmPassword={registerData.confirmPassword}
          firstName={registerData.firstName}
          lastName={registerData.lastName}
          isLoading={isLoading}
          onChange={handleRegisterChange}
          onSubmit={handleRegister}
        />
      </div>
    </div>
  );
}
