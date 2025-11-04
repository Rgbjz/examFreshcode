import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';
import ChatHeader from '../../ChatComponents/ChatHeader/ChatHeader';
import ChatInput from '../../ChatComponents/ChatInput/ChatInput';
import {
    getDialogMessages,
    clearMessageList,
} from '../../../../store/slices/chatSlice';
import styles from './Dialog.module.sass';

const Dialog = ({ userId }) => {
    const dispatch = useDispatch();

    const { messages, messagesPreview, interlocutor } = useSelector(
        state => state.chatStore
    );

    const messagesEndRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const loadDialog = useCallback(() => {
        if (interlocutor?.id) {
            dispatch(getDialogMessages({ interlocutorId: interlocutor.id }));
        }
    }, [dispatch, interlocutor]);

    useEffect(() => {
        loadDialog();
    }, [loadDialog]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        return () => {
            dispatch(clearMessageList());
        };
    }, [dispatch]);

    const getCurrentChatData = useCallback(() => {
        if (!interlocutor) return null;

        return messagesPreview.find(
            chat =>
                chat.participants.includes(userId) &&
                chat.participants.includes(interlocutor.id)
        );
    }, [messagesPreview, interlocutor, userId]);

    const chatData = getCurrentChatData();

    const renderMessages = () => {
        if (!messages?.length) {
            return <div className={styles.messageList} />;
        }

        let currentTime = moment();

        return (
            <div className={styles.messageList}>
                {messages.map((message, index) => {
                    const showDate = !currentTime.isSame(
                        message.createdAt,
                        'date'
                    );

                    if (showDate) currentTime = moment(message.createdAt);

                    return (
                        <React.Fragment key={index}>
                            {showDate && (
                                <div className={styles.date}>
                                    {moment(message.createdAt).format(
                                        'MMMM DD, YYYY'
                                    )}
                                </div>
                            )}

                            <div
                                className={classNames(
                                    userId === message.sender
                                        ? styles.ownMessage
                                        : styles.message
                                )}
                            >
                                <span>{message.body}</span>
                                <span className={styles.messageTime}>
                                    {moment(message.createdAt).format('HH:mm')}
                                </span>
                            </div>
                        </React.Fragment>
                    );
                })}

                <div ref={messagesEndRef} />
            </div>
        );
    };

    const renderBlockMessage = () => {
        const { blackList, participants } = chatData;
        const userIndex = participants.indexOf(userId);

        let message = '';
        if (blackList[userIndex]) {
            message = 'You block him';
        } else if (blackList.includes(true)) {
            message = 'He block you';
        }

        return <span className={styles.messageBlock}>{message}</span>;
    };

    return (
        <div className={styles.dialogContainer}>
            <ChatHeader
                userId={userId}
                chatData={chatData}
                interlocutor={interlocutor}
            />

            <div className={styles.messagesWrapper}>{renderMessages()}</div>

            {chatData && chatData.blackList.includes(true) ? (
                renderBlockMessage()
            ) : (
                <ChatInput />
            )}
        </div>
    );
};

export default Dialog;
