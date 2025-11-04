import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
    getContests,
    clearContestsList,
    setNewCustomerFilter,
} from '../../store/slices/contestsSlice';
import CONSTANTS from '../../constants';
import ContestsContainer from '../ContestsContainer/ContestsContainer';
import ContestBox from '../ContestBox/ContestBox';
import styles from './CustomerDashboard.module.sass';
import TryAgain from '../TryAgain/TryAgain';

const CustomerDashboard = ({ navigate }) => {
    const dispatch = useDispatch();
    const { contests, error, haveMore, customerFilter, isFetching } =
        useSelector(state => state.contestsList);

    const loadMore = startFrom => {
        dispatch(
            getContests({
                requestData: {
                    limit: 8,
                    offset: startFrom,
                    contestStatus: customerFilter,
                },
                role: CONSTANTS.CUSTOMER,
            })
        );
    };

    const getContestListRequest = useCallback(() => {
        dispatch(
            getContests({
                requestData: { limit: 8, contestStatus: customerFilter },
                role: CONSTANTS.CUSTOMER,
            })
        );
    }, [dispatch, customerFilter]);

    useEffect(() => {
        getContestListRequest();
        return () => {
            dispatch(clearContestsList());
        };
    }, []);
    useEffect(() => {
        if (!isFetching && contests.length === 0) {
            dispatch(clearContestsList());
            getContestListRequest();
        }
    }, [customerFilter]);

    const goToExtended = contest_id => {
        navigate(`/contest/${contest_id}`);
    };

    const setContestList = () =>
        contests.map((contest, i) => (
            <ContestBox
                data={contest}
                key={`${contest.id}-${i}`}
                goToExtended={goToExtended}
            />
        ));

    const tryToGetContest = () => {
        dispatch(clearContestsList());
        getContestListRequest();
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.filterContainer}>
                <div
                    onClick={() =>
                        dispatch(
                            setNewCustomerFilter(
                                CONSTANTS.CONTEST_STATUS_ACTIVE
                            )
                        )
                    }
                    className={classNames({
                        [styles.activeFilter]:
                            CONSTANTS.CONTEST_STATUS_ACTIVE === customerFilter,
                        [styles.filter]:
                            CONSTANTS.CONTEST_STATUS_ACTIVE !== customerFilter,
                    })}
                >
                    Active Contests
                </div>
                <div
                    onClick={() =>
                        dispatch(
                            setNewCustomerFilter(
                                CONSTANTS.CONTEST_STATUS_FINISHED
                            )
                        )
                    }
                    className={classNames({
                        [styles.activeFilter]:
                            CONSTANTS.CONTEST_STATUS_FINISHED ===
                            customerFilter,
                        [styles.filter]:
                            CONSTANTS.CONTEST_STATUS_FINISHED !==
                            customerFilter,
                    })}
                >
                    Completed contests
                </div>
                <div
                    onClick={() =>
                        dispatch(
                            setNewCustomerFilter(
                                CONSTANTS.CONTEST_STATUS_PENDING
                            )
                        )
                    }
                    className={classNames({
                        [styles.activeFilter]:
                            CONSTANTS.CONTEST_STATUS_PENDING === customerFilter,
                        [styles.filter]:
                            CONSTANTS.CONTEST_STATUS_PENDING !== customerFilter,
                    })}
                >
                    Inactive contests
                </div>
            </div>

            <div className={styles.contestsContainer}>
                {error ? (
                    <TryAgain getData={tryToGetContest} />
                ) : (
                    <ContestsContainer
                        isFetching={isFetching}
                        loadMore={loadMore}
                        navigate={navigate}
                        haveMore={haveMore}
                    >
                        {setContestList()}
                    </ContestsContainer>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
