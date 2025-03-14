import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: PaymentState = {
  isLoading: false,
  error: null,
  success: false,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setLoading, setError, setSuccess } = paymentSlice.actions;
export default paymentSlice.reducer;
