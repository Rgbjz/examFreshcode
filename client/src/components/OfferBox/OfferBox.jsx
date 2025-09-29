import React from 'react';
import { connect } from 'react-redux';
import Rating from 'react-rating';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { confirmAlert } from 'react-confirm-alert';
import withRouter from '../../hocs/withRouter';
import { goToExpandedDialog } from '../../store/slices/chatSlice';
import {
    changeMark,
    clearChangeMarkError,
    changeShowImage,
} from '../../store/slices/contestByIdSlice';
import CONSTANTS from '../../constants';
import styles from './OfferBox.module.sass';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './confirmStyle.css';

const OfferBox = props => {
    const { data, role, id, contestType } = props;
    const { avatar, firstName, lastName, email, rating } = data.User;

    const findConversationInfo = () => {
        const { messagesPreview } = props;
        const participants = [id, data.User.id].sort((a, b) => a - b);

        return (
            messagesPreview.find(msg =>
                isEqual(
                    msg.participants.sort((a, b) => a - b),
                    participants
                )
            ) || null
        );
    };

    const handleConfirm = command => {
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        props.setOfferStatus(data.User.id, data.id, command),
                },
                { label: 'No' },
            ],
        });
    };

    const needButtons = () => {
        if (role === CONSTANTS.CREATOR) return false;
        if (role === CONSTANTS.MODERATOR) return true;
        if (
            role === CONSTANTS.CUSTOMER &&
            data.status === CONSTANTS.OFFER_STATUS_APPROVED
        )
            return true;
        return false;
    };

    const renderOfferStatus = () => {
        if (data.status === CONSTANTS.OFFER_STATUS_REJECTED) {
            return (
                <i
                    className={classNames(
                        'fas fa-times-circle reject',
                        styles.reject
                    )}
                />
            );
        }
        if (data.status === CONSTANTS.OFFER_STATUS_WON) {
            return (
                <i
                    className={classNames(
                        'fas fa-check-circle resolve',
                        styles.resolve
                    )}
                />
            );
        }
        return null;
    };

    return (
        <div className={styles.offerContainer}>
            {renderOfferStatus()}
            <div className={styles.mainInfoContainer}>
                <div className={styles.userInfo}>
                    <div className={styles.creativeInfoContainer}>
                        <img
                            src={
                                avatar === 'anon.png'
                                    ? CONSTANTS.ANONYM_IMAGE_PATH
                                    : `${CONSTANTS.publicURL}${avatar}`
                            }
                            alt='user'
                        />
                        <div className={styles.nameAndEmail}>
                            <span>{`${firstName} ${lastName}`}</span>
                            <span>{email}</span>
                        </div>
                    </div>
                    <div className={styles.creativeRating}>
                        <span className={styles.userScoreLabel}>
                            Creative Rating{' '}
                        </span>
                        <Rating
                            initialRating={rating}
                            fractions={2}
                            fullSymbol={
                                <img
                                    src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                                    alt='star'
                                />
                            }
                            placeholderSymbol={
                                <img
                                    src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                                    alt='star'
                                />
                            }
                            emptySymbol={
                                <img
                                    src={`${CONSTANTS.STATIC_IMAGES_PATH}star-outline.png`}
                                    alt='star'
                                />
                            }
                            readonly
                        />
                    </div>
                </div>
                <div className={styles.responseConainer}>
                    {contestType === CONSTANTS.LOGO_CONTEST ? (
                        <img
                            onClick={() =>
                                props.changeShowImage({
                                    imagePath: data.fileName,
                                    isShowOnFull: true,
                                })
                            }
                            className={styles.responseLogo}
                            src={`${CONSTANTS.publicURL}${data.fileName}`}
                            alt='logo'
                        />
                    ) : (
                        <span className={styles.response}>{data.text}</span>
                    )}
                    {data.User.id !== id && (
                        <Rating
                            fractions={2}
                            fullSymbol={
                                <img
                                    src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                                    alt='star'
                                />
                            }
                            placeholderSymbol={
                                <img
                                    src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                                    alt='star'
                                />
                            }
                            emptySymbol={
                                <img
                                    src={`${CONSTANTS.STATIC_IMAGES_PATH}star-outline.png`}
                                    alt='star'
                                />
                            }
                            onClick={value => {
                                props.clearError();
                                props.changeMark({
                                    mark: value,
                                    offerId: data.id,
                                    isFirst: !data.mark,
                                    creatorId: data.User.id,
                                });
                            }}
                            placeholderRating={data.mark}
                        />
                    )}
                </div>
                {role !== CONSTANTS.CREATOR && (
                    <i
                        onClick={() =>
                            props.goToExpandedDialog({
                                interlocutor: data.User,
                                conversationData: findConversationInfo(),
                            })
                        }
                        className='fas fa-comments'
                    />
                )}
            </div>
            {needButtons() && (
                <div className={styles.btnsContainer}>
                    <div
                        onClick={() => handleConfirm('resolve')}
                        className={styles.resolveBtn}
                    >
                        Resolve
                    </div>
                    <div
                        onClick={() => handleConfirm('reject')}
                        className={styles.rejectBtn}
                    >
                        Reject
                    </div>
                </div>
            )}
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    changeMark: data => dispatch(changeMark(data)),
    clearError: () => dispatch(clearChangeMarkError()),
    goToExpandedDialog: data => dispatch(goToExpandedDialog(data)),
    changeShowImage: data => dispatch(changeShowImage(data)),
});

const mapStateToProps = state => {
    const { changeMarkError } = state.contestByIdStore;
    const { id, role } = state.userStore.data;
    const { messagesPreview } = state.chatStore;
    return { changeMarkError, id, role, messagesPreview };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OfferBox)
);
