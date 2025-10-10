import React from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import {
    setAddChatId,
    getDialogMessages,
} from '../../../../store/slices/chatSlice';
import CONSTANTS from '../../../../constants';
import styles from './DialogBox.module.sass';

const DialogBox = props => {
    const dispatch = useDispatch();

    const {
        chatPreview,
        userId,
        getTimeStr,
        changeFavorite,
        changeBlackList,
        catalogOperation,
        goToExpandedDialog,
        chatMode,
        interlocutor,
    } = props;

    if (!chatPreview) return null;

    const {
        favoriteList = [],
        participants = [],
        blackList = [],
        id,
        text,
        createAt,
    } = chatPreview;
    if (participants.length === 1 && participants[0] === userId) return null;

    const isFavorite = favoriteList[participants.indexOf(userId)];
    const isBlocked = blackList[participants.indexOf(userId)];

    const otherId = participants.find(p => p !== userId) || null;

    const safeInterlocutor =
        interlocutor ||
        (otherId
            ? { id: otherId, firstName: 'User', avatar: 'anon.png' }
            : null);

    const avatarSrc =
        safeInterlocutor?.avatar === 'anon.png'
            ? CONSTANTS.ANONYM_IMAGE_PATH
            : safeInterlocutor?.avatar
            ? `${CONSTANTS.publicURL}${safeInterlocutor.avatar}`
            : CONSTANTS.ANONYM_IMAGE_PATH;

    const firstName = safeInterlocutor?.firstName || 'User';

    const handleClick = () => {
        if (!otherId) return;

        dispatch(setAddChatId(id));

        if (!safeInterlocutor.id) {
            dispatch(getDialogMessages({ interlocutorId: otherId }));
            return;
        }

        goToExpandedDialog({
            interlocutor: safeInterlocutor,
            conversationData: { participants, id, blackList, favoriteList },
        });
    };

    return (
        <div className={styles.previewChatBox} onClick={handleClick}>
            <img src={avatarSrc} alt='user' />
            <div className={styles.infoContainer}>
                <div className={styles.interlocutorInfo}>
                    <span className={styles.interlocutorName}>{firstName}</span>
                    <span className={styles.interlocutorMessage}>{text}</span>
                </div>
                <div className={styles.buttonsContainer}>
                    <span className={styles.time}>{getTimeStr(createAt)}</span>
                    <i
                        onClick={event =>
                            changeFavorite(
                                { participants, favoriteFlag: !isFavorite },
                                event
                            )
                        }
                        className={classNames({
                            'far fa-heart': !isFavorite,
                            'fas fa-heart': isFavorite,
                        })}
                    />
                    <i
                        onClick={event =>
                            changeBlackList(
                                { participants, blackListFlag: !isBlocked },
                                event
                            )
                        }
                        className={classNames({
                            'fas fa-user-lock': !isBlocked,
                            'fas fa-unlock': isBlocked,
                        })}
                    />
                    <i
                        onClick={event => {
                            catalogOperation(event, id);
                            dispatch(setAddChatId(id));
                        }}
                        className={classNames({
                            'far fa-plus-square':
                                chatMode !==
                                CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
                            'fas fa-minus-circle':
                                chatMode ===
                                CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
                        })}
                    />
                </div>
            </div>
        </div>
    );
};

export default DialogBox;
