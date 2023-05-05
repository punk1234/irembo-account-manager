import { api } from "../api";

const extendedUserApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => "users",
    }),
    getUser: build.query({
      query: () => "me/profile",
    }),
    updateUser: build.mutation({
      query: (initialPost: {
        firstName: string;
        lastName: string;
        nationality: string;
        photo: string;
        gender: string;
        dateOfBirth: Date;
        maritalStatus: string;
      }) => ({
        url: "me/profile",
        method: "PATCH",
        body: initialPost,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useGetUserQuery, useUpdateUserMutation } =
  extendedUserApi;
