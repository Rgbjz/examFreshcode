import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCatalogList,
    removeChatFromCatalog,
} from '../../../../store/slices/chatSlice';
import CatalogList from '../CatalogList/CatalogList';
import DialogList from '../../DialogComponents/DialogList/DialogList';

const CatalogListContainer = () => {
    const dispatch = useDispatch();

    const chatStore = useSelector(state => state.chatStore);
    const userStore = useSelector(state => state.userStore);

    const {
        catalogList,
        isShowChatsInCatalog,
        messagesPreview,
        currentCatalog,
    } = chatStore;
    const { id: userId } = userStore.data || {};

    useEffect(() => {
        dispatch(getCatalogList());
    }, [dispatch]);

    const handleRemoveChat = useCallback(
        (event, chatId) => {
            const { id: catalogId } = currentCatalog || {};
            if (!catalogId) return;

            dispatch(removeChatFromCatalog({ chatId, catalogId }));
            event.stopPropagation();
        },
        [currentCatalog, dispatch]
    );

    const getDialogsPreview = useCallback(() => {
        if (!currentCatalog?.chats) return [];

        const chatIds = currentCatalog.chats.map(chat =>
            chat.id ? chat.id : chat
        );

        return messagesPreview.filter(msg => chatIds.includes(msg.id));
    }, [currentCatalog, messagesPreview]);

    return (
        <>
            {isShowChatsInCatalog ? (
                <DialogList
                    userId={userId}
                    preview={getDialogsPreview()}
                    removeChat={handleRemoveChat}
                />
            ) : (
                <CatalogList catalogList={catalogList} />
            )}
        </>
    );
};

export default CatalogListContainer;
