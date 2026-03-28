// "use client";

// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/Hooks/Redux/store";
// import { logInThunk } from "@/Hooks/Redux/Slices/authSlice";
// import { AppDispatch } from "@/Hooks/Redux/store";
// import {
//   FiLogIn,
//   FiMail,
//   FiLock,
//   FiCheckCircle,
//   FiEye,
//   FiEyeOff,
// } from "react-icons/fi";
// import Link from "next/link";


// export default function Login() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
//     "idle"
//   );

//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { isAuthenticated } = useSelector(
//     (state: RootState) => state.auth
//   );

//   const [isClient, setIsClient] = useState(false);


//   useEffect(() => {
//     setIsClient(true);
//   }, []);

// useEffect(() => {
//   if (isClient && isAuthenticated) {
//     router.push("/dashboard");
//   }
// }, [isClient, isAuthenticated, router]);

//   if (!isClient) {
//     return null; 
//   }
  
//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email))
//       newErrors.email = "Please enter a valid email";

//     if (!formData.password) newErrors.password = "Password is required";
//     else if (formData.password.length < 6)
//       newErrors.password = "Password must be at least 6 characters";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     setSubmitStatus("idle");

//     try {
//       await dispatch(
//         logInThunk({ email: formData.email, password: formData.password })
//       ).unwrap();
//       setSubmitStatus("success");

//       setTimeout(() => {
//         router.push("/dashboard");
//       }, 1000);
//     } catch (error: any) {
//       setSubmitStatus("error");
//       setErrors({ submit: error?.message || "Login failed" });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (submitStatus === "success") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 flex items-center justify-center p-8">
//         <div className="glass-effect p-16 rounded-4xl shadow-xl text-center max-w-xl border-emerald-300/30 backdrop-blur-2xl animate-float">
//           <div className="glass-button w-28 h-28 mx-auto mb-8 flex items-center justify-center rounded-3xl shadow-2xl border-emerald-300/50">
//             <FiCheckCircle className="w-16 h-16 text-emerald-400 drop-shadow-lg" />
//           </div>
//           <h1 className="text-4xl font-black text-white mb-6 drop-shadow-2xl">
//             Welcome Back!
//           </h1>
//           <p className="text-lg text-white/90 mb-12 font-semibold">
//             Redirecting to your dashboard...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white overflow-hidden relative">
//       {/* Animation blobs… same as before */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-80 h-80 animate-blob bg-gradient-to-r from-indigo-400/40 to-purple-400/40 rounded-full blur-3xl" />
//         <div className="absolute bottom-20 right-10 w-72 h-72 animation-delay-2000 animate-blob bg-gradient-to-r from-teal-400/30 to-emerald-400/30 rounded-full blur-3xl" />
//       </div>

//       <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
//         {/* Left side (cta) – same */}
//         <div className="hidden lg:flex lg:w-1/2 flex-col items-start justify-center px-16 text-left">
//           <h2 className="text-5xl font-black mb-6 leading-tight bg-gradient-to-r from-white via-gray-200 to-indigo-100 bg-clip-text text-transparent drop-shadow-2xl">
//             Secure Access
//           </h2>
//           <p className="text-lg text-white/85 font-semibold mb-12 max-w-lg leading-relaxed">
//             Log in to your account and continue managing your team, reports, and projects from anywhere.
//           </p>
//         </div>

//         {/* Right side (form) – same */}
//         <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
//           <div className="glass-effect rounded-4xl p-10 lg:p-12 shadow-2xl border-white/20 backdrop-blur-3xl relative overflow-hidden">
//             <div className="relative z-10 text-center mb-10">
//               <div className="glass-button w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-3xl shadow-2xl border-indigo-300/50">
//                 <FiLogIn className="w-10 h-10 text-indigo-400 drop-shadow-lg" />
//               </div>
//               <h1 className="text-4xl font-black text-white mb-3 drop-shadow-2xl">
//                 Welcome Back
//               </h1>
//               <p className="text-white/90 mb-8 text-lg font-semibold">
//                 Sign in to your account
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Email */}
//               <div>
//                 <label className="block text-white/95 text-sm font-bold mb-2 uppercase tracking-wider">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <FiMail className="absolute left-4 top-4 w-5 h-5 text-indigo-300" />
//                   <input
//                     type="email"
//                     placeholder="your@email.com"
//                     value={formData.email}
//                     onChange={(e) =>
//                       setFormData({ ...formData, email: e.target.value })
//                     }
//                     disabled={isSubmitting}
//                     className={`glass-button-secondary pl-11 pr-4 py-4 text-base font-semibold rounded-2xl border-2 w-full transition-all ${
//                       errors.email
//                         ? "border-rose-400/70 bg-rose-900/20"
//                         : "border-white/30"
//                     } ${
//                       isSubmitting ? "opacity-75 cursor-not-allowed" : ""
//                     }`}
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-rose-300 text-xs font-semibold mt-1 flex items-center gap-1">
//                     <FiEyeOff className="w-3 h-3" /> {errors.email}
//                   </p>
//                 )}
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-white/95 text-sm font-bold mb-2 uppercase tracking-wider">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <FiLock className="absolute left-4 top-4 w-5 h-5 text-indigo-300" />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     value={formData.password}
//                     onChange={(e) =>
//                       setFormData({ ...formData, password: e.target.value })
//                     }
//                     disabled={isSubmitting}
//                     className={`glass-button-secondary pl-11 pr-11 py-4 text-base font-semibold rounded-2xl border-2 w-full transition-all ${
//                       errors.password
//                         ? "border-rose-400/70 bg-rose-900/20"
//                         : "border-white/30"
//                     } ${
//                       isSubmitting ? "opacity-75 cursor-not-allowed" : ""
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-4 text-indigo-300 hover:text-white transition-colors"
//                   >
//                     {showPassword ? (
//                       <FiEyeOff className="w-5 h-5" />
//                     ) : (
//                       <FiEye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-rose-300 text-xs font-semibold mt-1 flex items-center gap-1">
//                     <FiEyeOff className="w-3 h-3" /> {errors.password}
//                   </p>
//                 )}
//               </div>

//               {/* Submit button */}
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`glass-button w-full py-4 px-6 text-base font-black rounded-2xl shadow-2xl transition-all ${
//                   isSubmitting
//                     ? "opacity-75 cursor-not-allowed"
//                     : "bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:-translate-y-0.5"
//                 }`}
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                     Signing in...
//                   </span>
//                 ) : (
//                   <span className="flex items-center justify-center gap-2">
//                     <FiLogIn className="w-4 h-4" />
//                     Sign In
//                   </span>
//                 )}
//               </button>

//               {errors.submit && (
//                 <div className="glass-button-secondary p-4 rounded-2xl border-rose-400/50 bg-rose-900/20 text-center text-white/90 text-sm font-semibold mt-4 flex items-center justify-center gap-2">
//                   <FiEyeOff className="w-4 h-4" />
//                   {errors.submit}
//                 </div>
//               )}
//             </form>

//             {/* Signup link */}
//             <div className="text-center mt-8 pt-6 border-t border-white/20">
//               <p className="text-white/80 text-sm mb-3">
//                 Don’t have an account?
//               </p>
//               <Link
//                 href="/signup"
//                 className="glass-button-secondary px-10 py-3 text-sm font-black rounded-2xl border-white/30 shadow-xl hover:shadow-white/30 transition-all"
//               >
//                 Create Account
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/Hooks/Redux/store";
import { logInThunk, logoutThunk } from "@/Hooks/Redux/Slices/authSlice";
import { AppDispatch } from "@/Hooks/Redux/store";
import {  FiMail, FiLock, FiCheckCircle, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isClient, isAuthenticated, router]);

  if (!isClient) {
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await dispatch(
        logInThunk({ email: formData.email, password: formData.password })
      ).unwrap();
      setSubmitStatus("success");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      setSubmitStatus("error");
      setErrors({ submit: error?.message || "Login failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 flex items-center justify-center p-8">
        <div className="glass-effect p-16 rounded-4xl shadow-xl text-center max-w-xl border-emerald-300/30 backdrop-blur-2xl animate-float">
          <div className="glass-button w-28 h-28 mx-auto mb-8 flex items-center justify-center rounded-3xl shadow-2xl border-emerald-300/50">
            <FiCheckCircle className="w-16 h-16 text-emerald-400 drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-black text-white mb-6 drop-shadow-2xl">
            Welcome Back!
          </h1>
          <p className="text-lg text-white/90 mb-12 font-semibold">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 animate-blob bg-gradient-to-r from-indigo-400/40 to-purple-400/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 animation-delay-2000 animate-blob bg-gradient-to-r from-teal-400/30 to-emerald-400/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        {/* CTA (left side, optional) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-start justify-center px-16 text-left">
          <h2 className="text-5xl font-black mb-6 leading-tight bg-gradient-to-r from-white via-gray-200 to-indigo-100 bg-clip-text text-transparent drop-shadow-2xl">
            Secure Access
          </h2>
          <p className="text-lg text-white/85 font-semibold mb-12 max-w-lg leading-relaxed">
            Log in to your account and continue managing your team, reports, and projects from anywhere.
          </p>
        </div>

        {/* Login form (right side) */}
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="glass-effect rounded-4xl p-10 lg:p-12 shadow-2xl border-white/20 backdrop-blur-3xl relative overflow-hidden">
            <div className="relative z-10 text-center mb-10">
              <div className="glass-button w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-3xl shadow-2xl border-indigo-300/50">
                <FiLogIn className="w-10 h-10 text-indigo-400 drop-shadow-lg" />
              </div>
              <h1 className="text-4xl font-black text-white mb-3 drop-shadow-2xl">
                Welcome Back
              </h1>
              <p className="text-white/90 mb-8 text-lg font-semibold">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-white/95 text-sm font-bold mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-4 w-5 h-5 text-indigo-300" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={isSubmitting}
                    className={`glass-button-secondary pl-11 pr-4 py-4 text-base font-semibold rounded-2xl border-2 w-full transition-all ${
                      errors.email
                        ? "border-rose-400/70 bg-rose-900/20"
                        : "border-white/30"
                    } ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-300 text-xs font-semibold mt-1 flex items-center gap-1">
                    <FiEyeOff className="w-3 h-3" /> {errors.email}
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
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    disabled={isSubmitting}
                    className={`glass-button-secondary pl-11 pr-11 py-4 text-base font-semibold rounded-2xl border-2 w-full transition-all ${
                      errors.password
                        ? "border-rose-400/70 bg-rose-900/20"
                        : "border-white/30"
                    } ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-4 text-indigo-300 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-rose-300 text-xs font-semibold mt-1 flex items-center gap-1">
                    <FiEyeOff className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Submit button */}
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
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FiLogIn className="w-4 h-4" />
                    Sign In
                  </span>
                )}
              </button>

              {errors.submit && (
                <div className="glass-button-secondary p-4 rounded-2xl border-rose-400/50 bg-rose-900/20 text-center text-white/90 text-sm font-semibold mt-4 flex items-center justify-center gap-2">
                  <FiEyeOff className="w-4 h-4" />
                  {errors.submit}
                </div>
              )}
            </form>

            {/* Signup link */}
            <div className="text-center mt-8 pt-6 border-t border-white/20">
              <p className="text-white/80 text-sm mb-3">
                Don’t have an account?
              </p>
              <Link
                href="/signup"
                className="glass-button-secondary px-10 py-3 text-sm font-black rounded-2xl border-white/30 shadow-xl hover:shadow-white/30 transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
