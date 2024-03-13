import { api as baseApi } from './lib/apiClient';
import { ordersApi } from './lib/order';

const api = {
  ...baseApi,
  ...ordersApi,
};

export { api };
