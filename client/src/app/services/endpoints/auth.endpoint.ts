import { api } from "../api";

const extendedAuthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (initialPost: {
        email: string;
        password: string;
        countryCode: string;
        firstName: string;
        lastName: string;
      }) => ({
        url: "auth/register",
        method: "POST",
        body: initialPost,
      }),
    }),
    userLogin: builder.mutation({
      query: (initialPost: { email: string; password: string }) => ({
        url: "auth/login",
        method: "POST",
        body: initialPost,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (initialPost: { code: string }) => ({
        url: "auth/twoFa/verify",
        method: "POST",
        body: initialPost,
      }),
    }),
    changePassword: builder.mutation({
      query: (initialPost: { password: string; newPassword: string }) => ({
        url: "changepassword",
        method: "POST",
        body: initialPost,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateUserMutation,
  useUserLoginMutation,
  useVerifyOtpMutation,
  useChangePasswordMutation,
} = extendedAuthApi;
