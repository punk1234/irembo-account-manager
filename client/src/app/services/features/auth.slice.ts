import { IUser } from "@/app/model/User.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AuthState {
  token: string | null;
  user: IUser | null;
  twoFaSetupCode: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  twoFaSetupCode: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    set2fa: (
      state,
      action: PayloadAction<{
        token: string;
        twoFaSetupCode: string;
      }>
    ) => {
      const { token, twoFaSetupCode } = action.payload;
      state.token = token;
      state.twoFaSetupCode = twoFaSetupCode;
    },
    setUserCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        user: IUser;
      }>
    ) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
    },
    logout: (state, action) => {
      state.token = null;
      state.user = null;
      state.twoFaSetupCode = null;
    },
  },
});

export const authSelector = (state: RootState) => state.auth;

export const { set2fa, setUserCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
