import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Order'],

  baseQuery: fetchBaseQuery({
    prepareHeaders: async (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
    baseUrl:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      import.meta.env.VITE_API_URL,
  }),
  endpoints: (_) => ({}),
});
