import { createSlice } from '@reduxjs/toolkit';
import { updateStoreAfterUpdateContest } from './contestByIdSlice';
import * as contestsApi from '../../api/rest/contestsApi';
import {
    decorateAsyncThunk,
    pendingReducer,
    fulfilledReducer,
    rejectedReducer,
} from '../../utils/store';

const CONTEST_UPDATION_SLICE_NAME = 'contestUpdation';

const initialState = {
    isFetching: true,
    error: null,
};

export const updateContest = decorateAsyncThunk({
    key: CONTEST_UPDATION_SLICE_NAME,
    thunk: async (payload, { dispatch }) => {
        const { contestId, formData } = payload;
        const { data } = await contestsApi.updateContest(contestId, formData);
        dispatch(updateStoreAfterUpdateContest(data));
    },
});

const reducers = {
    clearContestUpdationStore: () => initialState,
};

const extraReducers = builder => {
    builder.addCase(updateContest.pending, pendingReducer);
    builder.addCase(updateContest.fulfilled, fulfilledReducer);
    builder.addCase(updateContest.rejected, rejectedReducer);
};

const contestUpdationSlice = createSlice({
    name: CONTEST_UPDATION_SLICE_NAME,
    initialState,
    reducers,
    extraReducers,
});

const { actions, reducer } = contestUpdationSlice;

export const { clearContestUpdationStore } = actions;

export default reducer;
