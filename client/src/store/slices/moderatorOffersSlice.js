import { createSlice } from '@reduxjs/toolkit';
import * as offersApi from '../../api/rest/offerApi';
import {
    decorateAsyncThunk,
    rejectedReducer,
    createExtraReducers,
} from '../../utils/store';

const MODERATOR_OFFERS_SLICE_NAME = 'moderatorOffers';

const initialState = {
    isFetching: false,
    offers: [],
    pagination: {
        page: 1,
        totalPages: 1,
    },
    error: null,
    updateStatusError: null,
};

export const getAllOffers = decorateAsyncThunk({
    key: `${MODERATOR_OFFERS_SLICE_NAME}/getAllOffers`,
    thunk: async params => {
        const { data } = await offersApi.getAllOffers(params);
        return data;
    },
});

const getAllOffersExtraReducers = createExtraReducers({
    thunk: getAllOffers,
    pendingReducer: state => {
        state.isFetching = true;
        state.error = null;
    },
    fulfilledReducer: (state, { payload }) => {
        state.isFetching = false;
        state.offers = payload.offers;
        state.pagination = payload.pagination;
    },
    rejectedReducer,
});

export const setOfferStatusModerator = decorateAsyncThunk({
    key: `${MODERATOR_OFFERS_SLICE_NAME}/setOfferStatusModerator`,
    thunk: async payload => {
        const { data } = await offersApi.setOfferStatus(payload);
        return data;
    },
});

const setOfferStatusExtraReducers = createExtraReducers({
    thunk: setOfferStatusModerator,
    fulfilledReducer: (state, { payload }) => {
        state.offers = state.offers.map(offer =>
            offer.id === payload.id
                ? { ...offer, status: payload.status }
                : offer
        );
        state.updateStatusError = null;
    },
    rejectedReducer: (state, { payload }) => {
        state.updateStatusError = payload;
    },
});

const extraReducers = builder => {
    getAllOffersExtraReducers(builder);
    setOfferStatusExtraReducers(builder);
};

const moderatorOffersSlice = createSlice({
    name: MODERATOR_OFFERS_SLICE_NAME,
    initialState,
    reducers: {
        clearModeratorOffersError: state => {
            state.error = null;
            state.updateStatusError = null;
        },
        setOffersManually (state, action) {
            state.offers = action.payload;
        },
    },
    extraReducers,
});

export const { clearModeratorOffersError } = moderatorOffersSlice.actions;
export default moderatorOffersSlice.reducer;
