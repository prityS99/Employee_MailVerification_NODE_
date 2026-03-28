"use client";

import { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/change-password", {
        newPassword,
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white p-6">
      <div className="glass-effect p-10 rounded-3xl w-full max-w-md border-white/20 backdrop-blur-2xl shadow-2xl">
        
        <h2 className="text-3xl font-black mb-6 text-center">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* New Password */}
          <div className="relative">
            <FiLock className="absolute left-3 top-4 text-indigo-300" />
            <input
              type={show ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-10 pr-10 py-3 w-full rounded-xl bg-white/10 border border-white/30"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FiLock className="absolute left-3 top-4 text-indigo-300" />
            <input
              type={show ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10 py-3 w-full rounded-xl bg-white/10 border border-white/30"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-3"
            >
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {error && (
            <p className="text-rose-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>
      </div>
    </div>
  );
}