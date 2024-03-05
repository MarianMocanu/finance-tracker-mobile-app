import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/app/store';

export interface AuthState {
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state: AuthState) => {
      state.isLoggedIn = true;
    },
  },
  extraReducers: builder => {},
});

export const { login } = authSlice.actions;

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;

export default authSlice.reducer;
