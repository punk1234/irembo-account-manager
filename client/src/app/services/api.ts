import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

export const api = createApi({
  reducerPath: "irembo-api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8882/",
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = (getState() as RootState).auth.token;
      const param = new URLSearchParams(window.location.search);

      function getActualToken(authToken: any) {
        const tokenLength = authToken.length;
        const tokenSuffix = authToken.substr(tokenLength - 10);
        const tokenPrefix = authToken.substr(0, tokenLength - 18);
        const actualToken = tokenPrefix + tokenSuffix;

        return actualToken;
      }

      if (token && endpoint !== "refresh") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      if (param.get("code")) {
        headers.set(
          "Authorization",
          `Bearer ${getActualToken(param.get("code"))}`
        );
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
