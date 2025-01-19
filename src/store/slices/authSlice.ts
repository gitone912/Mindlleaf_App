import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signupUser } from "../../api/authApi";

interface AuthState {
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  message: null,
};

// Async thunk for signup
export const signup = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>("auth/signup", async (payload, { rejectWithValue }) => {
  try {
    return await signupUser(payload);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Signup failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearMessage(state) {
      state.message = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { clearMessage, clearError } = authSlice.actions;
export default authSlice.reducer;
