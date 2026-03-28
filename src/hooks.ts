// src/hooks.ts (or whatever path you like)
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/Hooks/Redux/store"; // or your store path

export const useAppDispatch = () => useDispatch<AppDispatch>();
