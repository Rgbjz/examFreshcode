import { createSlice } from '@reduxjs/toolkit';
import CONSTANTS from '../../constants';
import * as authApi from '../../api/rest/authApi';
import {
    decorateAsyncThunk,
    pendingReducer,
    fulfilledReducer,
    rejectedReducer,
} from '../../utils/store';

const AUTH_SLICE_NAME = 'auth';

const initialState = {
    isFetching: false,
    error: null,
};

export const checkAuth = decorateAsyncThunk({
    key: `${AUTH_SLICE_NAME}/checkAuth`,
    thunk: async ({ data: authInfo, navigate, authMode }) => {
        authMode === CONSTANTS.AUTH_MODE.LOGIN
            ? await authApi.loginRequest(authInfo)
            : await authApi.registerRequest(authInfo);
        navigate('/', { replace: true });
    },
});

const reducers = {
    clearAuthError: (state) => {
        state.error = null;
    },
    clearAuth: () => initialState,
};

const extraReducers = (builder) => {
    builder.addCase(checkAuth.pending, pendingReducer);
    builder.addCase(checkAuth.fulfilled, fulfilledReducer);
    builder.addCase(checkAuth.rejected, rejectedReducer);
};

const authSlice = createSlice({
    name: `${AUTH_SLICE_NAME}`,
    initialState,
    reducers,
    extraReducers,
});

const { actions, reducer } = authSlice;

export const { clearAuthError, clearAuth } = actions;

export default reducer;
