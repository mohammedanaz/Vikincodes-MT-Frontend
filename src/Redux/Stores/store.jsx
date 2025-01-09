import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from "../slices/AuthSlice"
import { encryptTransform } from 'redux-persist-transform-encrypt';

const rootReducer = combineReducers({
    userAuth: authReducer,
  });
  const persistConfig = {
    key: "root",
    storage,
    transforms: [
      encryptTransform({
        secretKey: 'my-super-secret-key',
        onError: function (error) {
          // Handle the error.
        },
      }),
    ],
  };
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  
  export const persistor = persistStore(store);