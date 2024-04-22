import {
  getExistingTransactionValueUrl,
  getUpdateExistingTransactionUrl,
  getUrl,
} from './lib/urls';

import { api as baseApi } from './lib/apiClient';
import { bomImportApi } from './lib/bomImport';
import { dataToJsonApi } from './lib/dataToJson';
import { viewsApi } from './lib/views';

const api = {
  ...baseApi,
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
