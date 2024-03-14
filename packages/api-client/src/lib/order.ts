import { api } from './apiClient';
import { Order } from '@orionsuite/dtos';

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => {
        return {
          url: `api/orders`,
          method: 'GET',
        };
      },
      providesTags: ['Order'],
    }),
  }),
});
