import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isAuthenticated: false,
    username: null,
    accessToken: null,
    refreshToken: null,
  };

const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
      setUser: (state, action) => {
        console.log('setUser reducere called...');
        
        state.isAuthenticated = true;
        state.username = action.payload.username;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        
      },
      refreshTokens: (state, action) => {
        console.log('refreshTokens reducer called...');
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
      },
      logout: (state) => {
        console.log('logout reducer called...');

        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.username = null;
      }
      },
    });
  
export const {setUser, refreshTokens, logout} = userAuthSlice.actions;

export default userAuthSlice.reducer;