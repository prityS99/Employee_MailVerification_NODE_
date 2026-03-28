"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks"; // or your path
import { getCurrentSession } from "@/Hooks/Redux/Slices/authSlice";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentSession()); 
  }, [dispatch]);

  return <>{children}</>;
}
