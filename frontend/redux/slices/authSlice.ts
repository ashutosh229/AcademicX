import { AuthState } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    status: 'loading',
    user: null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setAuthStatus(state, action: PayloadAction<AuthState>) {
            state.status = action.payload.status;
            state.user = action.payload.user;
        },
        clearAuth(state) {
            state.status = 'unauthenticated';
            state.user = null;
        },
    }
})

export const { setAuthStatus, clearAuth } = authSlice.actions;
export default authSlice.reducer;











