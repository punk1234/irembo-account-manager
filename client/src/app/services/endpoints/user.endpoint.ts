import { api } from "../api";

const extendedUserApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => "users",
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery } = extendedUserApi;
