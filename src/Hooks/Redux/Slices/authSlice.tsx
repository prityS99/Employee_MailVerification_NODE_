

import api from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface userState {
  user: any;
  token: string | undefined;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  role: "admin" | "employee" | null;
}

const initialState: userState = {
  user: null,
  token: "",
  loading: false,
  error: null,
  isAuthenticated: false,
  role: null,
};

// --- SIGNUP Thunk ---
export const signUpThunk = createAsyncThunk(
  "auth/signup",
  async (formData: { name: string; email: string; password: string }, thunkAPI) => {
    try {
      const res = await api.post("/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Signup failed"
      );
    }
  }
);

// --- LOGIN Thunk ---
// export const logInThunk = createAsyncThunk(
//   "auth/login",
//   async (
//     { email, password }: { email: string; password: string },
//     thunkAPI
//   ) => {
//     try {
//       const res = await api.post("/login", { email, password });

//       if (res.data.token) {
//         Cookies.set("token", res.data.token, { expires: 1 });
//       }

//       toast.success("Welcome back 👋");
//       return res.data;
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(
//         err.response?.data?.message || "Login failed"
//       );
//     }
//   }
// )

// --- LOGIN Thunk ---
export const logInThunk = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await api.post("/login", { email, password });

      // ✅ ADD HERE
      const { accessToken, refreshToken, user } = res.data;

      return {
        token: accessToken,
        refreshToken,
        user,
      };

    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

// --- LOGOUT Thunk (MOVED UP & FIXED) ---
export const logoutThunk = createAsyncThunk(
  "auth/signout",
  async (_, { rejectWithValue }) => {
    try {
      // Clear ALL auth cookies
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Clear sessionStorage backup
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      return { success: true };
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

// --- GET SESSION Thunk ---
export const getCurrentSession = createAsyncThunk(
  "auth/getSession",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/dashboard");
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Session expired");
    }
  }
);


export const loadUserThunk = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/me", {
        withCredentials: true,
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue("Not authenticated");
    }
  }
);
const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // SIGNUP
      .addCase(signUpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        toast.success("Signup successful 🎉");
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        const errorMsg = payload && typeof payload === 'object' && payload['message']
          ? payload['message']
          : payload || 'Signup failed';
        state.error = errorMsg;
        toast.error(errorMsg);
      })

      // LOGIN
      .addCase(logInThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logInThunk.fulfilled, (state, action) => {
        const { token, refreshToken, user } = action.payload;

        state.token = token;
        state.user = user;
        state.isAuthenticated = true;

        // ✅ store tokens
        Cookies.set("access_token", token, { expires: 1 / 24 });
        Cookies.set("refresh_token", refreshToken, { expires: 7 });
      })
      .addCase(logInThunk.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        const errorMsg = payload && typeof payload === 'object' && payload['message']
          ? payload['message']
          : payload || 'Login failed';
        state.error = errorMsg;
        toast.error(errorMsg);
      })

      .addCase(loadUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      // LOGOUT ✅ ADDED
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = undefined;
        state.isAuthenticated = false;
        state.role = null;
        state.loading = false;
        toast.info("Logged out 👋");
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.user = null;
        state.token = undefined;
        state.isAuthenticated = false;
      })

      // SESSION RESTORE
      .addCase(getCurrentSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(getCurrentSession.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = AuthSlice.actions;
export default AuthSlice.reducer;
