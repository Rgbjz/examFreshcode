import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';
import { initSocket } from '../api/ws/socketController';

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['contestCreation/saveContestToStore'],
                ignoredPaths: [
                    'contestCreationStore.contests.logo.file',
                    'contestCreationStore.contests.name.file',
                    'contestCreationStore.contests.tagline.file',
                ],
            },
        }),
});

initSocket(store);

export default store;
