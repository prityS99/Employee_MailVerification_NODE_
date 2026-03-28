"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Hooks/Redux/store";
import {
  LogOut,
  LayoutGrid,
  Search,
  Menu,
  X,
} from "lucide-react";
import { logoutThunk } from "@/Hooks/Redux/Slices/authSlice";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // ✅ Restore session on reload / navigation
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");

    if (storedUser && storedToken && !isAuthenticated) {
      dispatch({
        type: "auth/login/fulfilled",
        payload: {
          user: JSON.parse(storedUser),
          token: storedToken,
        },
      });
    }
  }, [dispatch, isAuthenticated]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await (dispatch as any)(logoutThunk());
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-[100] transition-all duration-300 ${isScrolled
        ? "bg-white/70 backdrop-blur-xl border-b border-slate-200/60 py-2 shadow-sm"
        : "bg-transparent py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">

          {/* Left */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 group-hover:scale-110 transition-transform">
                <LayoutGrid className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
                Nexus<span className="text-blue-600">HR</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/dashboard" active={pathname === "/dashboard"}>
                Dashboard
              </NavLink>
              <NavLink href="/admin/records" active={pathname === "/admin/records"}>
                Upcoming
              </NavLink>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Search */}
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors lg:hidden">
              <Search size={20} />
            </button>

            <div className="hidden lg:flex items-center bg-slate-100/50 border border-slate-200 rounded-full px-3 py-1.5 gap-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none text-xs focus:ring-0 w-24 focus:w-40 transition-all"
              />
            </div>

            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>


            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2">

                {/* 👤 User Info */}
                <div className="hidden md:flex flex-col text-right leading-tight">
                  <span className="text-xs text-slate-500 font-medium">
                    Welcome
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {user?.name || "User"}
                  </span>
                </div>

                {/* 🧿 Avatar */}
                <div className="w-15 h-8 rounded-full bg-gradient-to-tr from-white-500 to-white-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
               
                  <span className="text-[10px] text-blue-600 font-semibold uppercase">
                    {user?.role}
                  </span>
                </div>

                {/* 🚪 Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group"
                >
                  <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 p-4 space-y-3 shadow-xl">
          <Link href="/dashboard" className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
            Dashboard
          </Link>
          <Link href="/records" className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
            My Records
          </Link>
          <hr className="border-slate-100" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${active
        ? "text-blue-600 bg-blue-50/50"
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
        }`}
    >
      {children}
    </Link>
  );
}
