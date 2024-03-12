import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { todayApiCall1 } from "./weatherAPI";

const initialState = {
    status: 'idle',
    todayApiStatus : 'idle',
    todayData :[],
    rejected : null
}

export const todayApiCall = createAsyncThunk(
    'weather/fetchToday',
    async (cityName) => {
        const response = await todayApiCall1(cityName);
        return response
    }
)

export const weatherSlice = createSlice({
    name:'weather',
    initialState,
    reducers:
    {},
    extraReducers: (builder) => {
        builder
        .addCase(todayApiCall.pending,(state)=> {
            state.todayApiStatus = 'loading';
            state.rejected = null
        })
        .addCase(todayApiCall.fulfilled,(state,action)=> {
            state.todayApiStatus = 'idle';
            state.rejected = null
            state.todayData = action.payload;
        })
        .addCase(todayApiCall.rejected,(state)=>{
            state.rejected = 'Please Enter a Valid City Name'
        })
    }
});

export const todayResponse = (state) => state.weather.todayData;
export const responseRejected = (state) => state.weather.rejected;
export default weatherSlice.reducer;