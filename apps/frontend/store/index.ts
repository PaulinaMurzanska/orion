import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { api } from '@orionsuite/api-client';
import bomImportFilesReducer from './bom-store/bomImportFilesSlice';
import bomReducer from './bom-store/bomSlice';
import storage from 'redux-persist/lib/storage';
import recordsSlice from '../src/views/records/recordsSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['bomImportFiles'],
};

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  bomImportFiles: bomImportFilesReducer,
  recordsSlice: recordsSlice,
  bom: bomReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;

export { store, persistor };
