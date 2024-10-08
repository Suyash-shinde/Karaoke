import { createSlice } from "@reduxjs/toolkit";

const initialState={
    isAuth:false,
    user:null,
};

export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setAuth:(state, action) => {
            const {user} = action.payload;
            state.user=user;
            state.isAuth=true;
        },
        unsetAuth:(state,action)=>{
            state.user=null;
            state.isAuth=false;
        }
    }
})

export const {setAuth,unsetAuth} = authSlice.actions;
export default authSlice.reducer;
