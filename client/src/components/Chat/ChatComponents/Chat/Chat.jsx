import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import DialogListContainer from '../../DialogComponents/DialogListContainer/DialogListContainer';
import styles from './Chat.module.sass';
import Dialog from '../../DialogComponents/Dialog/Dialog';
import {
    changeChatShow,
    setPreviewChatMode,
    changeShowModeCatalog,
    clearChatError,
    getPreviewChat,
} from '../../../../store/slices/chatSlice';
import { chatController } from '../../../../api/ws/socketController';
import CONSTANTS from '../../../../constants';
import CatalogListContainer from '../../CatalogComponents/CatalogListContainer/CatalogListContainer';
import CatalogCreation from '../../CatalogComponents/CatalogCreation/CatalogCreation';
import CatalogListHeader from '../../CatalogComponents/CatalogListHeader/CatalogListHeader';
import ChatError from '../../../ChatError/ChatError';

const Chat = () => {
    const dispatch = useDispatch();

    const chatStore = useSelector(state => state.chatStore);
    const userStore = useSelector(state => state.userStore);

    const { id: userId } = userStore.data;
    const {
        isExpanded,
        isShow,
        isShowCatalogCreation,
        error,
        chatMode,
        isShowChatsInCatalog,
    } = chatStore;

    const {
        NORMAL_PREVIEW_CHAT_MODE,
        FAVORITE_PREVIEW_CHAT_MODE,
        BLOCKED_PREVIEW_CHAT_MODE,
        CATALOG_PREVIEW_CHAT_MODE,
    } = CONSTANTS;

    useEffect(() => {
        chatController.subscribeChat(userId);
        dispatch(getPreviewChat());

        return () => {
            chatController.unsubscribeChat(userId);
        };
    }, [dispatch, userId]);

    const handleChangeShow = useCallback(() => {
        dispatch(changeChatShow());
    }, [dispatch]);

    const handleSetPreviewMode = useCallback(
        mode => {
            dispatch(setPreviewChatMode(mode));
        },
        [dispatch]
    );

    const renderDialogList = () => (
        <div>
            {isShowChatsInCatalog && <CatalogListHeader />}

            {!isShowChatsInCatalog && (
                <div className={styles.chatHeader}>
                    <img
                        src={`${CONSTANTS.STATIC_IMAGES_PATH}logo.png`}
                        alt='logo'
                    />
                </div>
            )}

            {!isShowChatsInCatalog && (
                <div className={styles.buttonsContainer}>
                    <span
                        onClick={() =>
                            handleSetPreviewMode(NORMAL_PREVIEW_CHAT_MODE)
                        }
                        className={classNames(styles.button, {
                            [styles.activeButton]:
                                chatMode === NORMAL_PREVIEW_CHAT_MODE,
                        })}
                    >
                        Normal
                    </span>
                    <span
                        onClick={() =>
                            handleSetPreviewMode(FAVORITE_PREVIEW_CHAT_MODE)
                        }
                        className={classNames(styles.button, {
                            [styles.activeButton]:
                                chatMode === FAVORITE_PREVIEW_CHAT_MODE,
                        })}
                    >
                        Favorite
                    </span>
                    <span
                        onClick={() =>
                            handleSetPreviewMode(BLOCKED_PREVIEW_CHAT_MODE)
                        }
                        className={classNames(styles.button, {
                            [styles.activeButton]:
                                chatMode === BLOCKED_PREVIEW_CHAT_MODE,
                        })}
                    >
                        Blocked
                    </span>
                    <span
                        onClick={() =>
                            handleSetPreviewMode(CATALOG_PREVIEW_CHAT_MODE)
                        }
                        className={classNames(styles.button, {
                            [styles.activeButton]:
                                chatMode === CATALOG_PREVIEW_CHAT_MODE,
                        })}
                    >
                        Catalog
                    </span>
                </div>
            )}

            {chatMode === CATALOG_PREVIEW_CHAT_MODE ? (
                <CatalogListContainer />
            ) : (
                <DialogListContainer userId={userId} />
            )}
        </div>
    );

    return (
        <div
            className={classNames(styles.chatContainer, {
                [styles.showChat]: isShow,
            })}
        >
            {error && <ChatError getData={() => dispatch(getPreviewChat())} />}
            {isShowCatalogCreation && <CatalogCreation />}

            {isExpanded ? <Dialog userId={userId} /> : renderDialogList()}

            <div className={styles.toggleChat} onClick={handleChangeShow}>
                {isShow ? 'Hide Chat' : 'Show Chat'}
            </div>
        </div>
    );
};

export default Chat;
