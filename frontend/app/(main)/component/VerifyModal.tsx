"use client";

import { useState } from "react";
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
import { verifyOtp } from "@/lib/features/authSlice"; // create this thunk in your authSlice
import { Label } from "@/components/ui/label";

interface VerifyOtpModalProps {
  open: boolean;
  onClose: () => void;
  email: string | null;
}

const VerifyOtpModal = ({ open, onClose, email }: VerifyOtpModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [otp, setOtp] = useState("");

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (email) await dispatch(verifyOtp({ email, otp })).unwrap();
      toast.success("OTP verified successfully");
      onClose(); // close modal
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "OTP verification failed";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Verify OTP
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6 mt-6" onSubmit={handleVerifyOtp}>
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

          <Button className="w-full" size="sm" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyOtpModal;
