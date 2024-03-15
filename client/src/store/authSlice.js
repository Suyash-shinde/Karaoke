import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:null,
};

export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setAuth:(state, action) => {
            const {user} = action.payload;
            state.user=user;
        }
    }
})

export const {setAuth} = authSlice.actions;
export default authSlice.reducer;
