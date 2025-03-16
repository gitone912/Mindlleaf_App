import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  subscriptionStatus: 'none' | 'active' | 'expired';
}

const initialState: PaymentState = {
  isLoading: false,
  error: null,
  success: false,
  subscriptionStatus: 'none',
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
    setSubscriptionStatus: (state, action: PayloadAction<'none' | 'active' | 'expired'>) => {
      state.subscriptionStatus = action.payload;
    },
    resetPaymentState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const { 
  setLoading, 
  setError, 
  setSuccess, 
  setSubscriptionStatus,
  resetPaymentState 
} = paymentSlice.actions;
export default paymentSlice.reducer;
