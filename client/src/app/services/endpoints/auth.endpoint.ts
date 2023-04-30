import { api } from "../api";

const extendedAuthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (initialPost: { email: string; password: string }) => ({
        url: "signup",
        method: "POST",
        body: initialPost,
      }),
    }),
    userLogin: builder.mutation({
      query: (initialPost: { email: string; password: string }) => ({
        url: "login",
        method: "POST",
        body: initialPost,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useCreateUserMutation, useUserLoginMutation } = extendedAuthApi;
