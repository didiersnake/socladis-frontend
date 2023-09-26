import { apiSlice } from "../../app/api/apiSlice";

//inject endpoint to apiSlice
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "api/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
