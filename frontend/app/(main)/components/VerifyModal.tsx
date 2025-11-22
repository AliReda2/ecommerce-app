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
import { resendOtp, verifyOtp } from "@/lib/features/authSlice";
import { Label } from "@/components/ui/label";

interface VerifyOtpModalProps {
  open: boolean;
  onClose: () => void;
  email: string | undefined;
}

const VerifyOtpModal = ({ open, onClose, email }: VerifyOtpModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isVerifyingOtp } = useSelector((state: RootState) => state.auth);

  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiresIn, setOtpExpiresIn] = useState(600);

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing");
      return;
    }

    dispatch(verifyOtp({ email, otp }))
      .unwrap()
      .then(() => {
        toast.success("OTP verified successfully");
        onClose();
      })
      .catch((error) => toast.error(error));
  };

  const handleResendOtp = () => {
    if (!email) {
      toast.error("Email is missing");
      return;
    }

    dispatch(resendOtp({ email }))
      .unwrap()
      .then(() => {
        toast.success("OTP sent");
        setResendCooldown(90);
        setOtpExpiresIn(600);
      })
      .catch((error) => toast.error(error));
  };

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
            Verify OTP
          </DialogTitle>
        </DialogHeader>

        <div>
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
                value={email ?? ""}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <Label>Enter OTP sent to {email}</Label>
              <Input
                className="mt-1 text-center tracking-widest"
                placeholder="123456"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <Button className="w-full" size="sm" disabled={isVerifyingOtp}>
              {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyOtpModal;
