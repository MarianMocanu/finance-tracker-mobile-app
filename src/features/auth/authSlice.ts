import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import axios, { setTokenInAxiosHeaders } from '@services/axios';
import { User } from 'src/models/User';
import { deleteTokenFromStorage, getTokenFromStorage, saveTokenInStorage } from 'src/app/util';
import { AppDispatch } from 'src/app/store';

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
    idle: (state: AuthState) => {
      state.status = 'idle';
    },
    request: (state: AuthState) => {
      state.status = 'loading';
    },
    signupSuccess: (state: AuthState) => {
      state.status = 'succeeded';
    },
    loginSuccess: (state: AuthState, action: PayloadAction<User>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.status = 'succeeded';
    },
    logoutSuccess: (state: AuthState) => {
      state.isLoggedIn = false;
      state.user = null;
      state.status = 'succeeded';
    },
    failure: (state: AuthState) => {
      state.isLoggedIn = false;
      state.user = null;
      state.status = 'failed';
    },
  },
});

type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export const signUp = (payload: SignupPayload) => async (dispatch: AppDispatch) => {
  dispatch(request());
  try {
    const response = await axios.post<User>('/auth/signup', payload);
    if (response.data.id) {
      dispatch(signupSuccess());
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error(error);
    dispatch(failure());
  } finally {
    dispatch(idle());
  }
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
  user: User;
  token: string;
};

export const logIn = (payload: LoginPayload) => async (dispatch: AppDispatch) => {
  dispatch(request());
  try {
    const response = await axios.post<AuthResponse>('/auth/login', payload);
    const { user, token } = response.data;
    if (user && token) {
      await saveTokenInStorage(token);
      setTokenInAxiosHeaders(token);
      dispatch(loginSuccess(user));
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error(error);
    dispatch(failure());
  } finally {
    dispatch(idle());
  }
};

export const autoLogIn = () => async (dispatch: AppDispatch) => {
  dispatch(request());
  setTimeout(async () => {
    try {
      const storedToken = await getTokenFromStorage();
      if (storedToken) {
        const response = await axios.get<AuthResponse>('/auth/verify', {
          headers: { authorization: storedToken },
        });
        const { user, token } = response.data;
        if (user && token) {
          await saveTokenInStorage(token);
          setTokenInAxiosHeaders(token);
          dispatch(loginSuccess(response.data.user));
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        throw new Error('No token found');
      }
    } catch (error) {
      console.error(error);
      dispatch(failure());
    } finally {
      dispatch(idle());
    }
  }, 2000);
};

export const logOut = () => async (dispatch: AppDispatch) => {
  dispatch(request());
  try {
    await deleteTokenFromStorage();
    setTokenInAxiosHeaders('');
    dispatch(logoutSuccess());
  } catch (error) {
    console.error(error);
    dispatch(failure());
  } finally {
    dispatch(idle());
  }
};

export const { idle, request, signupSuccess, loginSuccess, logoutSuccess, failure } =
  authSlice.actions;

export default authSlice.reducer;
