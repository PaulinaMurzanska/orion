import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PERSIST,
  PAUSE,
  REHYDRATE,
  REGISTER,
  PURGE,
  persistStore,
  persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { api } from '@orionsuite/api-client';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [],
};

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
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
