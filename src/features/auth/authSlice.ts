import { Dispatch, PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/app/store';
import axios from '@services/axios';
import { User } from 'src/models/User';

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  status: 'idle',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signupRequest: (state: AuthState) => {
      state.status = 'loading';
    },
    signupSuccess: (state: AuthState, action: PayloadAction<User>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.status = 'succeeded';
    },
    signupFailure: (state: AuthState) => {
      state.isLoggedIn = false;
      state.user = null;
      state.status = 'failed';
    },
    signupIdle: (state: AuthState) => {
      state.status = 'idle';
    },
  },
});

type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export const signup = (payload: SignupPayload) => async (dispatch: Dispatch) => {
  dispatch(signupRequest());
  try {
    const response = await axios.post('/auth/signup', payload);
    dispatch(signupSuccess(response.data));
  } catch (error) {
    dispatch(signupFailure());
  } finally {
    dispatch(signupIdle());
  }
};

export const { signupRequest, signupFailure, signupSuccess, signupIdle } = authSlice.actions;

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;

export default authSlice.reducer;
