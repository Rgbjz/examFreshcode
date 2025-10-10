import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import CONSTANTS from '../../../../constants';
import {
    goToExpandedDialog,
    changeChatFavorite,
    changeChatBlock,
    changeShowAddChatToCatalogMenu,
} from '../../../../store/slices/chatSlice';
import DialogBox from '../DialogBox/DialogBox';
import styles from './DialogList.module.sass';

const DialogList = ({
    userId,
    preview,
    goToExpandedDialog,
    changeChatFavorite,
    changeChatBlock,
    changeShowAddChatToCatalogMenu,
    chatMode,
    removeChat,
}) => {
    const changeFavorite = (data, event) => {
        changeChatFavorite(data);
        event.stopPropagation();
    };

    const changeBlackList = (data, event) => {
        changeChatBlock(data);
        event.stopPropagation();
    };

    const changeShowCatalogCreation = (event, chatId) => {
        changeShowAddChatToCatalogMenu(chatId);
        event.stopPropagation();
    };

    const onlyFavoriteDialogs = chatPreview =>
        chatPreview.favoriteList[chatPreview.participants.indexOf(userId)];

    const onlyBlockDialogs = chatPreview =>
        chatPreview.blackList[chatPreview.participants.indexOf(userId)];

    const getTimeStr = time => {
        const currentTime = moment();
        if (currentTime.isSame(time, 'day'))
            return moment(time).format('HH:mm');
        if (currentTime.isSame(time, 'week'))
            return moment(time).format('dddd');
        if (currentTime.isSame(time, 'year'))
            return moment(time).format('MM DD');
        return moment(time).format('MMMM DD, YYYY');
    };

    const renderPreview = filterFunc => {
        if (!preview || !preview.length)
            return <span className={styles.notFound}>Not found</span>;

        const sortedPreview = [...preview]
            .filter(chat => {
                const participants = chat.participants || [];
                return !(
                    participants.length === 1 && participants[0] === userId
                );
            })
            .sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

        const dialogs = sortedPreview
            .map((chatPreview, index) => {
                if (filterFunc && !filterFunc(chatPreview)) return null;

                const key = chatPreview.id || chatPreview._id || index;
                return (
                    <DialogBox
                        key={key}
                        interlocutor={chatPreview.interlocutor}
                        chatPreview={chatPreview}
                        userId={userId}
                        getTimeStr={getTimeStr}
                        changeFavorite={changeFavorite}
                        changeBlackList={changeBlackList}
                        chatMode={chatMode}
                        catalogOperation={
                            chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE
                                ? removeChat
                                : changeShowCatalogCreation
                        }
                        goToExpandedDialog={goToExpandedDialog}
                    />
                );
            })
            .filter(Boolean);

        return dialogs.length ? (
            dialogs
        ) : (
            <span className={styles.notFound}>Not found</span>
        );
    };

    const renderChatPreview = () => {
        if (chatMode === CONSTANTS.FAVORITE_PREVIEW_CHAT_MODE)
            return renderPreview(onlyFavoriteDialogs);
        if (chatMode === CONSTANTS.BLOCKED_PREVIEW_CHAT_MODE)
            return renderPreview(onlyBlockDialogs);
        return renderPreview();
    };

    return <div className={styles.previewContainer}>{renderChatPreview()}</div>;
};

const mapStateToProps = state => state.chatStore;

const mapDispatchToProps = dispatch => ({
    goToExpandedDialog: data => dispatch(goToExpandedDialog(data)),
    changeChatFavorite: data => dispatch(changeChatFavorite(data)),
    changeChatBlock: data => dispatch(changeChatBlock(data)),
    changeShowAddChatToCatalogMenu: data =>
        dispatch(changeShowAddChatToCatalogMenu(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogList);
