import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../features/weatherApp/reduxStore/weatherSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});
