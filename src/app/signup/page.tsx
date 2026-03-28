"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpThunk } from "@/Hooks/Redux/Slices/authSlice";
import { AppDispatch } from "@/Hooks/Redux/store";
import {
  FiUserPlus,
  FiMail,
  FiLock,
  FiCheckCircle,
  FiUser,
  FiEdit2,
} from "react-icons/fi";
import { FiUsers, FiBarChart } from "react-icons/fi"; 

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee" as "admin" | "employee",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const roleOptions = [
    { value: "employee", label: "Employee", description: "Join as regular team member" },
    { value: "admin", label: "Admin", description: "Full system access (for organization owners)" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.length < 2)
      newErrors.name = "Name must be at least 2 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await dispatch(signUpThunk(formData)).unwrap();
      setSubmitStatus("success");

      setTimeout(() => {
        router.push("/login?signup=success");
      }, 2000);
    } catch (error: any) {
      setSubmitStatus("error");
      setErrors({ submit: error?.message || "Signup failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  
  useEffect(() => {

  }, [router]);

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 flex items-center justify-center p-8">
        <div className="glass-effect p-16 rounded-4xl shadow-2xl text-center max-w-2xl border-emerald-300/30 backdrop-blur-2xl animate-float">
          <div className="glass-button w-28 h-28 mx-auto mb-8 flex items-center justify-center rounded-3xl shadow-2xl border-emerald-300/50">
            <FiCheckCircle className="w-16 h-16 text-emerald-400 drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-black text-white mb-6 drop-shadow-2xl">
            Account Created!
          </h1>
          <p className="text-2xl text-white/95 mb-8 font-semibold">
            Welcome to the team, <span className="text-emerald-200 font-black">{formData.name}</span>!
          </p>
          <p className="text-lg text-white/90 mb-8">
            Redirecting you to login...
          </p>
          <Link
            href="/login"
            className="glass-button px-12 py-6 text-xl font-black shadow-2xl"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white overflow-hidden relative flex items-center justify-center">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 animate-blob bg-gradient-to-r from-indigo-400/40 to-purple-400/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 animation-delay-2000 animate-blob bg-gradient-to-r from-teal-400/30 to-emerald-400/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden">
        {/* Left side – info panel */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 py-24">
          <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-indigo-100 bg-clip-text text-transparent leading-tight drop-shadow-2xl">
            Join the Team
          </h2>
          <p className="text-white/90 text-lg mb-12 leading-relaxed max-w-lg">
            Create your account and start managing employees, reports, and analytics in one place.
          </p>

          <div className="space-y-4 text-white/90">
            <div className="flex items-center gap-3">
              <FiUserPlus className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-semibold">Admin or Employee roles</span>
            </div>
            <div className="flex items-center gap-3">
              <FiUsers className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold">Team management dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <FiBarChart className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold">Analytics & reports</span>
            </div>
          </div>
        </div>

        {/* Right side – signup form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="glass-effect rounded-4xl p-10 lg:p-12 shadow-2xl border-white/20 backdrop-blur-3xl relative overflow-hidden w-full max-w-lg mx-auto">
            {/* Shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 -skew-x-12 transform -translate-x-full hover:translate-x-full transition-transform duration-1000 opacity-0 hover:opacity-100 pointer-events-none rounded-4xl"></div>

            <div className="relative z-10 text-center mb-10">
              <div className="glass-button w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-3xl shadow-2xl border-indigo-300/50">
                <FiUserPlus className="w-12 h-12 text-indigo-400 drop-shadow-lg" />
              </div>
              <h1 className="text-4xl font-black text-white mb-3 drop-shadow-2xl">
                Create Account
              </h1>
              <p className="text-white/90 mb-8 text-lg font-semibold">
                Join {formData.role === "admin" ? "as Admin" : "our team"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-white/95 text-sm font-bold mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-4 w-5 h-5 text-indigo-300" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`glass-button-secondary pl-11 pr-4 py-4 text-base font-semibold rounded-2xl border-2 w-full transition-all ${
                      errors.name
                        ? "border-rose-400/70 bg-rose-900/20"
                        : "border-white/30"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-rose-300 text-xs font-semibold mt-1 flex items-center gap-1">
                    <FiEdit2 className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white/95 text-sm font-bold mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-4 w-5 h-5 text-indigo-300" />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`glass-button-secondary pl-11 pr-4 py-4 text-base font-semibold rounded-2xl border-2 w-full transition-all ${
                      errors.email
                        ? "border-rose-400/70 bg-rose-900/20"
                        : "border-white/30"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-300 text-xs font-semibold mt-1 flex items-center gap-1">
                    <FiEdit2 className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-white/95 text-sm font-bold mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-4 w-5 h-5 text-indigo-300" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={`glass-button-secondary pl-11 pr-4 py-4 text-base font-semibold rounded-2xl border-2 w-full transition-all ${
                      errors.password
                        ? "border-rose-400/70 bg-rose-900/20"
                        : "border-white/30"
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-rose-300 text-xs font-semibold mt-1 flex items-center gap-1">
                    <FiEdit2 className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-white/95 text-sm font-bold mb-4 uppercase tracking-wider">
                  Account Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roleOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-4 p-4 glass-button-secondary rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.role === option.value
                          ? "border-indigo-400/70"
                          : "border-white/30 hover:border-white/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={formData.role === option.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            role: e.target.value as "admin" | "employee",
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          formData.role === option.value
                            ? "bg-indigo-500 border-indigo-500 scale-110 shadow-lg shadow-indigo-500/50"
                            : "border-white/50"
                        }`}
                      >
                        {formData.role === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="block font-black text-sm capitalize">
                          {option.label}
                        </span>
                        <span className="text-xs text-white/80">
                          {option.description}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`glass-button w-full py-4 px-6 text-base font-black rounded-2xl shadow-2xl transition-all ${
                  isSubmitting
                    ? "opacity-75 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:-translate-y-0.5"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FiUserPlus className="w-4 h-4" />
                    Create Account
                  </span>
                )}
              </button>

              {errors.submit && (
                <div className="glass-button-secondary p-4 rounded-2xl border-rose-400/50 bg-rose-900/20 text-center text-white/90 text-xs font-semibold mt-4 flex items-center justify-center gap-2">
                  <FiEdit2 className="w-4 h-4" />
                  {errors.submit}
                </div>
              )}
            </form>

            {/* Login link */}
            <div className="text-center mt-8 pt-6 border-t border-white/20">
              <p className="text-white/80 text-xs mb-3">
                Already have an account?
              </p>
              <Link
                href="/login"
                className="glass-button-secondary px-10 py-3 text-xs font-black rounded-2xl border-white/30 shadow-xl hover:shadow-white/30 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


