import {
  getExistingTransactionValueUrl,
  getUpdateExistingTransactionUrl,
  getUrl,
} from './lib/urls';

import { api as baseApi } from './lib/apiClient';
import { bomImportApi } from './lib/bomImport';
import { dataToJsonApi } from './lib/dataToJson';
import { ordersApi } from './lib/order';
import { viewsApi } from './lib/views';

const api = {
  ...baseApi,
  ...ordersApi,
  ...dataToJsonApi,
  ...bomImportApi,
  ...viewsApi,
};

export {
  api,
  getUrl,
  getExistingTransactionValueUrl,
  getUpdateExistingTransactionUrl,
};
