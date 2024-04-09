import { api as baseApi } from './lib/apiClient';
import { ordersApi } from './lib/order';
import { dataToJsonApi } from './lib/dataToJson';
import { bomImportApi } from './lib/bomImport';

const api = {
  ...baseApi,
  ...ordersApi,
  ...dataToJsonApi,
  ...bomImportApi,
};

export { api };
