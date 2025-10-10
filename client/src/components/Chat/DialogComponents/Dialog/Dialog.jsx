import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import className from 'classnames';
import ChatHeader from '../../ChatComponents/ChatHeader/ChatHeader';
import ChatInput from '../../ChatComponents/ChatInut/ChatInput';
import {
    getDialogMessages,
    clearMessageList,
} from '../../../../store/slices/chatSlice';
import styles from './Dialog.module.sass';

class Dialog extends React.Component {
    messagesEnd = React.createRef();

    componentDidMount () {
        this.loadDialog();
    }

    componentDidUpdate (prevProps) {
        if (
            this.props.interlocutor &&
            prevProps.interlocutor?.id !== this.props.interlocutor?.id
        ) {
            this.loadDialog();
        }

        if (this.messagesEnd.current) this.scrollToBottom();
    }

    componentWillUnmount () {
        this.props.clearMessageList();
    }

    loadDialog = () => {
        const { interlocutor } = this.props;
        if (interlocutor?.id) {
            this.props.getDialog({ interlocutorId: interlocutor.id });
        }
    };

    scrollToBottom = () => {
        this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
    };

    getCurrentChatData = () => {
        const { messagesPreview, interlocutor, userId } = this.props;
        if (!interlocutor) return null;

        return messagesPreview.find(
            chat =>
                chat.participants.includes(userId) &&
                chat.participants.includes(interlocutor.id)
        );
    };

    renderMainDialog = () => {
        const { messages, userId } = this.props;
        if (!messages || !messages.length)
            return <div className={styles.messageList} />;

        let currentTime = moment();
        return (
            <div className={styles.messageList}>
                {messages.map((message, i) => {
                    const showDate = !currentTime.isSame(
                        message.createdAt,
                        'date'
                    );
                    if (showDate) currentTime = moment(message.createdAt);

                    return (
                        <React.Fragment key={i}>
                            {showDate && (
                                <div className={styles.date}>
                                    {moment(message.createdAt).format(
                                        'MMMM DD, YYYY'
                                    )}
                                </div>
                            )}
                            <div
                                className={className(
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
                <div ref={this.messagesEnd} />
            </div>
        );
    };

    renderBlockMessage = chatData => {
        const { userId } = this.props;
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

    render () {
        const { userId, interlocutor } = this.props;
        const chatData = this.getCurrentChatData();

        return (
            <>
                <ChatHeader
                    userId={userId}
                    chatData={chatData}
                    interlocutor={interlocutor}
                />
                {this.renderMainDialog()}
                {chatData && chatData.blackList.includes(true) ? (
                    this.renderBlockMessage(chatData)
                ) : (
                    <ChatInput />
                )}
            </>
        );
    }
}

const mapStateToProps = state => state.chatStore;

const mapDispatchToProps = dispatch => ({
    getDialog: data => dispatch(getDialogMessages(data)),
    clearMessageList: () => dispatch(clearMessageList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
