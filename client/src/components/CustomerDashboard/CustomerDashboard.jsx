import React, { useEffect, useCallback, useRef } from 'react';
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

    const prevFilterRef = useRef(customerFilter);

    const loadContests = useCallback(
        (offset = 0) => {
            dispatch(
                getContests({
                    requestData: {
                        limit: 8,
                        offset,
                        contestStatus: customerFilter,
                    },
                    role: CONSTANTS.CUSTOMER,
                })
            );
        },
        [dispatch, customerFilter]
    );

    useEffect(() => {
        dispatch(clearContestsList());
        loadContests(0);
    }, []);

    useEffect(() => {
        if (prevFilterRef.current !== customerFilter) {
            prevFilterRef.current = customerFilter;
            dispatch(clearContestsList());
            loadContests(0);
        }
    }, [customerFilter, loadContests, dispatch]);

    const loadMore = () => {
        if (!isFetching && haveMore) {
            loadContests(contests.length);
        }
    };

    const goToExtended = id => navigate(`/contest/${id}`);

    const tryToGetContest = () => {
        dispatch(clearContestsList());
        loadContests(0);
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
                        haveMore={haveMore}
                    >
                        {contests.map(c => (
                            <ContestBox
                                key={c.id}
                                data={c}
                                goToExtended={goToExtended}
                            />
                        ))}
                    </ContestsContainer>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
