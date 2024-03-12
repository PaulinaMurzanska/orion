import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
  EndpointBuilder,
  BaseQueryApi,
  EndpointDefinitions,
} from '@reduxjs/toolkit/query/react';
import { createSlice } from '@reduxjs/toolkit';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { MaybePromise } from '@reduxjs/toolkit/dist/query/tsHelpers';

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Order'],
  baseQuery: fetchBaseQuery({
    baseUrl:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      import.meta.env.VITE_API_URL,
  }),
  endpoints: (_) => ({}),
});
