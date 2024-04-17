import { api as baseApi } from './lib/apiClient';
import { bomImportApi } from './lib/bomImport';
import { dataToJsonApi } from './lib/dataToJson';
import { getUrl } from './lib/urls';
import { ordersApi } from './lib/order';

const api = {
  ...baseApi,
  ...ordersApi,
  ...dataToJsonApi,
  ...bomImportApi,
};

export { api, getUrl };
