import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "con-flow-api",
  baseQuery: fetchBaseQuery({
    baseUrl: "api/v1/",
  }),
  endpoints: () => ({}),
});
