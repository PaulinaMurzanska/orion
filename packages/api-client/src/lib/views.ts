import { api } from './apiClient';
import { GetViewsResponse } from '@orionsuite/dtos';

export const viewsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getViews: builder.query<GetViewsResponse, void>({
      query: () => {
        return {
          url: `?scriptID=300&deploymentID=1&script=220&deploy=1&compid=TD2893635&h=2666e10fd32e93612036`,
          method: 'GET',
        };
      },
      providesTags: [],
    }),
  }),
});
