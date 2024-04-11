import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const persistConfig ={
    key: 'kara',
    storage
}

const persistAuthReducer = persistReducer(persistConfig, auth)

export const store = configureStore({
    reducer: {
        auth: persistAuthReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
      }),
});

export const persistedStore  = persistStore(store);