import {
  getExistingTransactionValueUrl,
  getUpdateExistingTransactionUrl,
  getUrl,
} from './lib/urls';

import { api as baseApi } from './lib/apiClient';
import { bomImportApi } from './lib/bomImport';
import { dataToJsonApi } from './lib/dataToJson';
import { ordersApi } from './lib/order';

const api = {
  ...baseApi,
  ...ordersApi,
  ...dataToJsonApi,
  ...bomImportApi,
};

export {
  api,
  getUrl,
  getExistingTransactionValueUrl,
  getUpdateExistingTransactionUrl,
};
