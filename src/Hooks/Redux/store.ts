import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./Slices/authSlice"
import employeeReducer from "./Slices/employeeSlice"



export const store = configureStore({
reducer: { 
    auth: authReducer,
    employee: employeeReducer
} ,
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

