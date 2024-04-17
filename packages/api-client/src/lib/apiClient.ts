import {
  BaseQueryApi,
  BaseQueryFn,
  EndpointBuilder,
  EndpointDefinitions,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import { MaybePromise } from '@reduxjs/toolkit/dist/query/tsHelpers';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { createSlice } from '@reduxjs/toolkit';

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Order'],

  baseQuery: fetchBaseQuery({
    prepareHeaders: async (headers, { getState }) => {
      // headers.set('authorization', `Bearer Ml__kgLernFbvoOoRfUcJnGEgbNKvM1GPh6Zv8tg6Vg=AAABjnS1eUrRKZpvZlKZLgYb03cVt31_6Q81QNvc5W1gPH-cAISzMA`);
      // headers.set('Content-Type', 'application/json');

      return headers;
    },
    baseUrl:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      import.meta.env.VITE_API_URL,
  }),
  endpoints: (_) => ({}),
});
