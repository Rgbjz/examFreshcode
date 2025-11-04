import React, { useEffect, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import LightBox from 'react-18-image-lightbox';
import withRouter from '../../hocs/withRouter';

import {
    goToExpandedDialog,
    getDialogMessages,
} from '../../store/slices/chatSlice';

import {
    getContestById,
    setOfferStatus,
    clearSetOfferStatusError,
    changeEditContest,
    changeContestViewMode,
    changeShowImage,
} from '../../store/slices/contestByIdSlice';

import Header from '../../components/Header/Header';
import ContestSideBar from '../../components/ContestSideBar/ContestSideBar';
import styles from './ContestPage.module.sass';
import OfferBox from '../../components/OfferBox/OfferBox';
import OfferForm from '../../components/OfferForm/OfferForm';
import CONSTANTS from '../../constants';
import Brief from '../../components/Brief/Brief';
import Spinner from '../../components/Spinner/Spinner';
import TryAgain from '../../components/TryAgain/TryAgain';
import 'react-18-image-lightbox/style.css';
import Error from '../../components/Error/Error';

const ContestPage = ({
    params,
    contestByIdStore,
    userStore,
    chatStore,
    getData,
    changeEditContest,
    clearSetOfferStatusError,
    setOfferStatus,
    changeShowImage,
    changeContestViewMode,
    getDialogMessages,
}) => {
    const { id } = params;
    const { role } = userStore.data;

    const {
        isShowOnFull,
        imagePath,
        error,
        isFetching,
        isBrief,
        contestData,
        offers,
        setOfferStatusError,
    } = contestByIdStore;

    /** componentDidMount */
    useEffect(() => {
        getData({ contestId: id });
    }, [id, getData]);

    /** componentWillUnmount */
    useEffect(() => {
        return () => {
            changeEditContest(false);
        };
    }, [changeEditContest]);

    const needButtons = useCallback(
        offerStatus => {
            const contestCreatorId = contestData?.User?.id;
            const userId = userStore.data.id;
            const contestStatus = contestData?.status;

            return (
                contestCreatorId === userId &&
                contestStatus === CONSTANTS.CONTEST_STATUS_ACTIVE &&
                offerStatus === CONSTANTS.OFFER_STATUS_PENDING
            );
        },
        [contestData, userStore]
    );

    const setOfferStatusHandler = useCallback(
        (creatorId, offerId, command) => {
            clearSetOfferStatusError();

            const { id, orderId, priority } = contestData;

            const payload = {
                command,
                offerId,
                creatorId,
                orderId,
                priority,
                contestId: id,
            };

            setOfferStatus(payload);
        },
        [contestData, clearSetOfferStatusError, setOfferStatus]
    );

    const offersList = useMemo(() => {
        if (!offers.length) {
            return (
                <div className={styles.notFound}>
                    There is no suggestion at this moment
                </div>
            );
        }

        return offers.map(offer => (
            <OfferBox
                key={offer.id}
                data={offer}
                needButtons={needButtons}
                setOfferStatus={setOfferStatusHandler}
                contestType={contestData.contestType}
                date={new Date()}
            />
        ));
    }, [offers, needButtons, setOfferStatusHandler, contestData]);

    const goChat = () => {
        const { User } = contestData;
        getDialogMessages({ interlocutorId: User.id });
    };

    return (
        <div>
            {isShowOnFull && (
                <LightBox
                    mainSrc={`${CONSTANTS.publicURL}${imagePath}`}
                    onCloseRequest={() =>
                        changeShowImage({
                            isShowOnFull: false,
                            imagePath: null,
                        })
                    }
                />
            )}

            {error ? (
                <div className={styles.tryContainer}>
                    <TryAgain getData={() => getData({ contestId: id })} />
                </div>
            ) : isFetching ? (
                <div className={styles.containerSpinner}>
                    <Spinner />
                </div>
            ) : (
                <div className={styles.mainInfoContainer}>
                    <div className={styles.infoContainer}>
                        <div className={styles.buttonsContainer}>
                            <span
                                onClick={() => changeContestViewMode(true)}
                                className={classNames(styles.btn, {
                                    [styles.activeBtn]: isBrief,
                                })}
                            >
                                Brief
                            </span>
                            <span
                                onClick={() => changeContestViewMode(false)}
                                className={classNames(styles.btn, {
                                    [styles.activeBtn]: !isBrief,
                                })}
                            >
                                Offer
                            </span>
                        </div>

                        {isBrief ? (
                            <Brief
                                contestData={contestData}
                                role={role}
                                goChat={goChat}
                            />
                        ) : (
                            <div className={styles.offersContainer}>
                                {role === CONSTANTS.CREATOR &&
                                    contestData.status ===
                                        CONSTANTS.CONTEST_STATUS_ACTIVE && (
                                        <OfferForm
                                            contestType={
                                                contestData.contestType
                                            }
                                            contestId={contestData.id}
                                            customerId={contestData.User.id}
                                        />
                                    )}

                                {setOfferStatusError && (
                                    <Error
                                        data={setOfferStatusError.data}
                                        status={setOfferStatusError.status}
                                        clearError={clearSetOfferStatusError}
                                    />
                                )}

                                <div className={styles.offers}>
                                    {offersList}
                                </div>
                            </div>
                        )}
                    </div>

                    <ContestSideBar
                        contestData={contestData}
                        totalEntries={offers.length}
                    />
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => {
    const { contestByIdStore, userStore, chatStore } = state;
    return { contestByIdStore, userStore, chatStore };
};

const mapDispatchToProps = {
    getData: getContestById,
    setOfferStatus,
    clearSetOfferStatusError,
    goToExpandedDialog,
    changeEditContest,
    changeContestViewMode,
    changeShowImage,
    getDialogMessages,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ContestPage));
