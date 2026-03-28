import api from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface EmployeeState {
  employees: any[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};
// 1️⃣ Thunk
export const fetchEmployeesThunk = createAsyncThunk(
  "employees/fetch",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/employee");

      // If backend returns plain array, wrap it
      return Array.isArray(data)
        ? { users: data }
        : data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch employees"
      );
    }
  }
);

// 2️⃣ Slice
const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeesThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Assume backend always returns { users: [...] } or similar
        state.employees = Array.isArray(action.payload.users)
          ? action.payload.users
          : [];
      })
      .addCase(fetchEmployeesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default employeeSlice.reducer;
