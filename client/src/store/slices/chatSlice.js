import { createSlice } from '@reduxjs/toolkit';
import { isEqual, remove } from 'lodash';
import * as chatApi from '../../api/rest/chatApi';
import CONSTANTS from '../../constants';
import {
    decorateAsyncThunk,
    createExtraReducers,
    rejectedReducer,
} from '../../utils/store';

const CHAT_SLICE_NAME = 'chat';

const initialState = {
    isFetching: true,
    addChatId: null,
    isShowCatalogCreation: false,
    currentCatalog: null,
    chatData: null,
    messages: [],
    error: null,
    isExpanded: false,
    interlocutor: [],
    messagesPreview: [],
    isShow: false,
    chatMode: CONSTANTS.NORMAL_PREVIEW_CHAT_MODE,
    catalogList: [],
    isRenameCatalog: false,
    isShowChatsInCatalog: false,
    catalogCreationMode: CONSTANTS.ADD_CHAT_TO_OLD_CATALOG,
    selectedChatId: null,
};

export const getPreviewChat = decorateAsyncThunk({
    key: `${CHAT_SLICE_NAME}/getPreviewChat`,
    thunk: async () => {
        const { data } = await chatApi.getPreviewChat();
        return data;
    },
});

const getPreviewChatExtraReducers = createExtraReducers({
    thunk: getPreviewChat,
    fulfilledReducer: (state, { payload }) => {
        state.messagesPreview = payload;
        state.error = null;
    },
    rejectedReducer: (state, { payload }) => {
        state.error = payload;
        state.messagesPreview = [];
    },
});

export const getDialogMessages = decorateAsyncThunk({
    key: `${CHAT_SLICE_NAME}/getDialogMessages`,
    thunk: async payload => {
        const { data } = await chatApi.getDialog(payload);
        return data;
    },
});

const getDialogMessagesExtraReducers = createExtraReducers({
    thunk: getDialogMessages,
    fulfilledReducer: (state, { payload }) => {
        state.messages = payload.messages || [];
        state.interlocutor = payload.interlocutor || null;

        const oldFavList = state.chatData?.favoriteList || [];
        const oldBlackList = state.chatData?.blackList || [];

        state.chatData = {
            id: payload.conversationId,
            participants: [payload.selfId, payload.interlocutor?.id]
                .filter(Boolean)
                .sort((a, b) => a - b),
            favoriteList: payload.favoriteList?.length
                ? payload.favoriteList
                : oldFavList.length
                ? oldFavList
                : [false, false],
            blackList: payload.blackList?.length
                ? payload.blackList
                : oldBlackList.length
                ? oldBlackList
                : [false, false],
        };

        state.isShow = true;
        state.isExpanded = true;
        state.error = null;
    },
    rejectedReducer: state => {
        state.messages = [];
        state.interlocutor = null;
        state.chatData = null;
        state.error = null;
    },
});

export const sendMessage = decorateAsyncThunk({
    key: `${CHAT_SLICE_NAME}/sendMessage`,
    thunk: async payload => {
        const { data } = await chatApi.newMessage(payload);
        return data;
    },
});

const sendMessageExtraReducers = createExtraReducers({
    thunk: sendMessage,
    fulfilledReducer: (state, { payload }) => {
        const message = payload?.message;
        const preview = payload?.preview;
        if (!message) return;

        const chatId = preview?.id || message.id;
        const participants = (
            preview?.participants ||
            message.participants ||
            []
        ).map(Number);
        const senderId = Number(message.sender);
        const interlocutorId = participants.find(id => id !== senderId);
        const interlocutor =
            preview?.interlocutor ||
            (interlocutorId
                ? { id: interlocutorId, firstName: 'User', avatar: 'anon.png' }
                : null);

        const oldPreview = state.messagesPreview.find(p => p.id === chatId);
        const oldFavList = oldPreview?.favoriteList || [false, false];
        const oldBlackList = oldPreview?.blackList || [false, false];

        state.messages.push(message);

        const idx = state.messagesPreview.findIndex(p => p.id === chatId);
        const updatedPreview = {
            ...(idx !== -1 ? state.messagesPreview[idx] : preview || {}),
            id: chatId,
            text: message.body,
            sender: message.sender,
            createAt: message.createdAt,
            interlocutor,
            participants,
            favoriteList: preview?.favoriteList || oldFavList,
            blackList: preview?.blackList || oldBlackList,
        };

        if (idx !== -1) state.messagesPreview[idx] = updatedPreview;
        else state.messagesPreview.push(updatedPreview);

        const oldChatData = state.chatData || {};
        state.chatData = {
            ...oldChatData,
            id: chatId,
            participants,
            favoriteList: oldChatData.favoriteList || oldFavList,
            blackList: oldChatData.blackList || oldBlackList,
        };

        state.messagesPreview = Array.from(
            new Map(state.messagesPreview.map(p => [p.id, p])).values()
        );
    },
});

export const changeChatFavorite = decorateAsyncThunk({
    key: `${CHAT_SLICE_NAME}/changeChatFavorite`,
    thunk: async payload => {
        const { data } = await chatApi.changeChatFavorite(payload);
        return data;
    },
});

const changeChatFavoriteExtraReducers = createExtraReducers({
    thunk: changeChatFavorite,
    fulfilledReducer: (state, { payload }) => {
        if (state.chatData && payload.favoriteList?.length) {
            state.chatData.favoriteList = [...payload.favoriteList];
        }

        state.messagesPreview = state.messagesPreview.map(preview =>
            isEqual(preview.participants, payload.participants)
                ? { ...preview, favoriteList: payload.favoriteList }
                : preview
        );
    },
    rejectedReducer: (state, { payload }) => {
        state.error = payload;
    },
});

export const changeChatBlock = decorateAsyncThunk({
    key: `${CHAT_SLICE_NAME}/changeChatBlock`,
    thunk: async payload => {
        const { data } = await chatApi.changeChatBlock(payload);
        return data;
    },
});
const changeChatBlockExtraReducers = createExtraReducers({
    thunk: changeChatBlock,
    fulfilledReducer: (state, { payload }) => {
        if (state.chatData && payload.blackList?.length) {
            state.chatData.blackList = [...payload.blackList];
        }

        state.messagesPreview = state.messagesPreview.map(preview =>
            isEqual(preview.participants, payload.participants)
                ? { ...preview, blackList: payload.blackList }
                : preview
        );
    },
    rejectedReducer: (state, { payload }) => {
        state.error = payload;
    },
});

export const getCatalogList = decorateAsyncThunk({
    key: `${CHAT_SLICE_NAME}/getCatalogList`,
    thunk: async payload => {
        const { data } = await chatApi.getCatalogList(payload);
        return data;
    },
});

const getCatalogListExtraReducers = createExtraReducers({
    thunk: getCatalogList,
    fulfilledReducer: (state, { payload }) => {
        state.isFetching = false;
        state.catalogList = [...payload];
    },
    rejectedReducer,
});

export const addChatToCatalog = decorateAsyncThunk({
    key: `${CHAT_SLICE_NAME}/addChatToCatalog`,
    thunk: async payload => {
        const { data } = await chatApi.addNewChatToCatalog(payload);
        return data;
    },
});

const addChatToCatalogExtraReducers = createExtraReducers({
    thunk: addChatToCatalog,
    fulfilledReducer: (state, { payload }) => {
        const updatedChats = Array.isArray(payload.chats) ? payload.chats : [];

        state.catalogList = state.catalogList.map(c =>
            c.id === payload.id
                ? {
                      ...c,
                      chats: updatedChats,
                      catalogName: payload.catalogName,
                  }
                : c
        );

        if (state.currentCatalog && state.currentCatalog.id === payload.id) {
            state.currentCatalog = {
                ...state.currentCatalog,
                chats: updatedChats,
                catalogName: payload.catalogName,
            };
        }

        state.isShowCatalogCreation = false;
        state.error = null;
    },
    rejectedReducer: (state, { payload }) => {
        state.error = payload;
        state.isShowCatalogCreation = false;
    },
});

export const createCatalog = decorateAsyncThunk({
    key: `${CHAT_SLICE_NAME}/createCatalog`,
    thunk: async payload => {
        const { data } = await chatApi.createCatalog(payload);
        return data;
    },
});

const createCatalogExtraReducers = createExtraReducers({
    thunk: createCatalog,
    fulfilledReducer: (state, { payload }) => {
        state.catalogList = [...state.catalogList, payload];
        state.isShowCatalogCreation = false;
    },
    rejectedReducer: (state, { payload }) => {
        state.isShowCatalogCreation = false;
        state.error = payload;
    },
});

export const deleteCatalog = decorateAsyncThunk({
    key: `${CHAT_SLICE_NAME}/deleteCatalog`,
    thunk: async catalogId => {
        await chatApi.deleteCatalog(catalogId);
        return catalogId; // возвращаем просто ID
    },
});

const deleteCatalogExtraReducers = createExtraReducers({
    thunk: deleteCatalog,
    fulfilledReducer: (state, { payload }) => {
        state.catalogList = state.catalogList.filter(
            catalog => catalog.id !== payload // т.к. payload — просто id
        );
    },
    rejectedReducer: (state, { payload }) => {
        state.error = payload;
    },
});

export const removeChatFromCatalog = decorateAsyncThunk({
    key: `${CHAT_SLICE_NAME}/removeChatFromCatalog`,
    thunk: async payload => {
        const { data } = await chatApi.removeChatFromCatalog(payload);
        return data;
    },
});

const removeChatFromCatalogExtraReducers = createExtraReducers({
    thunk: removeChatFromCatalog,
    fulfilledReducer: (state, { payload }) => {
        const { id, conversations } = payload;

        const chats =
            conversations?.map(conv => ({
                id: conv.id,
                createdAt: conv.createdAt,
                updatedAt: conv.updatedAt,
            })) || [];

        state.catalogList = state.catalogList.map(catalog =>
            catalog.id === id ? { ...catalog, chats } : catalog
        );

        if (state.currentCatalog && state.currentCatalog.id === id) {
            state.currentCatalog = {
                ...state.currentCatalog,
                chats,
            };
        }

        state.error = null;
    },
    rejectedReducer: (state, { payload }) => {
        state.error = payload;
    },
});

export const changeCatalogName = decorateAsyncThunk({
    key: `${CHAT_SLICE_NAME}/changeCatalogName`,
    thunk: async payload => {
        const { data } = await chatApi.changeCatalogName(payload);
        return data;
    },
});

const changeCatalogNameExtraReducers = createExtraReducers({
    thunk: changeCatalogName,
    fulfilledReducer: (state, { payload }) => {
        const { catalogList, currentCatalog } = state;

        const updatedCatalogList = catalogList.map(c =>
            c.id === payload.id ? { ...c, catalogName: payload.catalogName } : c
        );
        state.catalogList = updatedCatalogList;

        if (currentCatalog?.id === payload.id) {
            state.currentCatalog = {
                ...currentCatalog,
                catalogName: payload.catalogName,
            };
        }

        state.isRenameCatalog = false;
    },
    rejectedReducer: state => {
        state.isRenameCatalog = false;
    },
});

export const backToDialogList = () => async (dispatch, getState) => {
    try {
        dispatch(chatSlice.actions._backToDialogList());

        const preview = await dispatch(getPreviewChat()).unwrap();

        dispatch(chatSlice.actions.setMessagesPreview(preview));
    } catch (err) {
        dispatch(chatSlice.actions._backToDialogList());
    }
};

//-------------------------------------------------------

const reducers = {
    changeBlockStatusInStore: (state, { payload }) => {
        if (!state.chatData) return;
        state.chatData = { ...payload };
    },

    addMessage: (state, { payload }) => {
        const message = payload?.message;
        const preview = payload?.preview;
        if (!message) return;

        const chatId = preview?.id || message.id;
        const participants = (
            preview?.participants ||
            message.participants ||
            []
        ).map(Number);
        const senderId = Number(message.sender);
        const interlocutorId = participants.find(id => id !== senderId);
        const interlocutor =
            preview?.interlocutor ||
            (interlocutorId
                ? { id: interlocutorId, firstName: 'User', avatar: 'anon.png' }
                : null);

        const oldPreview = state.messagesPreview.find(p => p.id === chatId);
        const oldFavList = oldPreview?.favoriteList || [false, false];
        const oldBlackList = oldPreview?.blackList || [false, false];
        
        state.messages.push(message);
        
        const idx = state.messagesPreview.findIndex(p => p.id === chatId);
        const updatedPreview = {
            ...(idx !== -1 ? state.messagesPreview[idx] : preview || {}),
            id: chatId,
            text: message.body,
            sender: message.sender,
            createAt: message.createdAt,
            interlocutor,
            participants,
            favoriteList: preview?.favoriteList || oldFavList,
            blackList: preview?.blackList || oldBlackList,
        };

        if (idx !== -1) state.messagesPreview[idx] = updatedPreview;
        else state.messagesPreview.push(updatedPreview);
        
        const oldChatData = state.chatData || {};
        state.chatData = {
            ...oldChatData,
            id: chatId,
            participants,
            favoriteList: oldChatData.favoriteList || [false, false],
            blackList: oldChatData.blackList || [false, false],
        };
        
        state.messagesPreview = Array.from(
            new Map(state.messagesPreview.map(p => [p.id, p])).values()
        );
    },

    _backToDialogList: state => {
        state.isExpanded = false;
        state.chatData = null;
        state.messages = [];
        state.interlocutor = null;
        state.selectedChatId = null;
    },

    setMessagesPreview: (state, { payload }) => {
        state.messagesPreview = payload;
    },

    goToExpandedDialog: (state, { payload }) => {
        state.interlocutor = { ...state.interlocutor, ...payload.interlocutor };
        state.chatData = payload.conversationData;
        state.isShow = true;
        state.isExpanded = true;
        state.messages = [];
    },

    clearMessageList: state => {
        state.messages = [];
    },

    changeChatShow: state => {
        state.isShowCatalogCreation = false;
        state.isShow = !state.isShow;
    },

    setPreviewChatMode: (state, { payload }) => {
        state.chatMode = payload;
    },

    changeShowModeCatalog: (state, { payload }) => {
        state.currentCatalog = { ...state.currentCatalog, ...payload };
        state.isShowChatsInCatalog = !state.isShowChatsInCatalog;
        state.isRenameCatalog = false;
    },

    changeTypeOfChatAdding: (state, { payload }) => {
        state.catalogCreationMode = payload;
    },

    changeShowAddChatToCatalogMenu: (state, { payload }) => {
        state.addChatId = payload;
        state.isShowCatalogCreation = !state.isShowCatalogCreation;
    },

    changeRenameCatalogMode: state => {
        state.isRenameCatalog = !state.isRenameCatalog;
    },

    clearChatError: state => {
        state.error = null;
    },
    setAddChatId: (state, { payload }) => {
        state.selectedChatId = payload; 
    },
};

const extraReducers = builder => {
    getPreviewChatExtraReducers(builder);
    getDialogMessagesExtraReducers(builder);
    sendMessageExtraReducers(builder);
    changeChatFavoriteExtraReducers(builder);
    changeChatBlockExtraReducers(builder);
    getCatalogListExtraReducers(builder);
    addChatToCatalogExtraReducers(builder);
    createCatalogExtraReducers(builder);
    deleteCatalogExtraReducers(builder);
    removeChatFromCatalogExtraReducers(builder);
    changeCatalogNameExtraReducers(builder);
};

const chatSlice = createSlice({
    name: CHAT_SLICE_NAME,
    initialState,
    reducers,
    extraReducers,
});

const { actions, reducer } = chatSlice;

export const {
    changeBlockStatusInStore,
    addMessage,
    goToExpandedDialog,
    clearMessageList,
    changeChatShow,
    setPreviewChatMode,
    changeShowModeCatalog,
    changeTypeOfChatAdding,
    changeShowAddChatToCatalogMenu,
    changeRenameCatalogMode,
    clearChatError,
    setMessagesPreview,
    setAddChatId,
} = actions;

export default reducer;
