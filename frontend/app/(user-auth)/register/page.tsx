import { useState } from "react";
import { ChevronLeftIcon, EyeIcon, EyeCloseIcon } from "@/icons";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AppDispatch, RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { showError, showSuccess } from "@/lib/alert";
import { register } from "@/lib/features/authSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Register = () => {
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

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.id]: e.target.value });
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
      router.replace("/dashboard");
    } catch (err: any) {
      showError(err || "Failed to register");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
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
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to create an account.
            </p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label>First Name</Label>
                  <Input
                    className="mt-1"
                    type="text"
                    id="firstName"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input
                    className="mt-1"
                    type="text"
                    id="lastName"
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  className="mt-1"
                  type="email"
                  id="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label>Password</Label>
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="Enter your password"
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

              <div>
                <Label>Confirm Password</Label>
                <Input
                  className="mt-1"
                  type="password"
                  id="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium transition rounded-lg shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Sign Up"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account?
              <Link
                href="/admin-auth/login"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
