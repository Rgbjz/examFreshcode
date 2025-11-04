import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import {
    getContests,
    clearContestsList,
    setNewCreatorFilter,
} from '../../store/slices/contestsSlice';
import { getDataForContest } from '../../store/slices/dataForContestSlice';
import withRouter from '../../hocs/withRouter';
import ContestsContainer from '../ContestsContainer/ContestsContainer';
import ContestBox from '../ContestBox/ContestBox';
import styles from './CreatorDashboard.module.sass';
import TryAgain from '../TryAgain/TryAgain';
import CONSTANTS from '../../constants';

const types = [
    '',
    'name,tagline,logo',
    'name',
    'tagline',
    'logo',
    'name,tagline',
    'logo,tagline',
    'name,logo',
];

const CreatorDashboard = ({
    contests,
    creatorFilter,
    dataForContest,
    getContests,
    clearContestsList,
    newFilter,
    getDataForContest,
    location,
    navigate,
    error,
    haveMore,
    isFetching,
}) => {
    const parseUrlForParams = useCallback(
        search => {
            const obj = queryString.parse(search);
            const filter = {
                typeIndex: obj.typeIndex || 1,
                contestId: obj.contestId ? obj.contestId : '',
                industry: obj.industry ? obj.industry : '',
                awardSort: obj.awardSort || 'asc',
                ownEntries:
                    typeof obj.ownEntries === 'undefined'
                        ? false
                        : obj.ownEntries,
                onlyActive:
                    typeof obj.onlyActive === 'undefined'
                        ? false
                        : obj.onlyActive === 'true' || obj.onlyActive === true,
            };

            if (!isEqual(filter, creatorFilter)) {
                newFilter(filter);
                clearContestsList();
                getContests({
                    limit: 8,
                    offset: 0,
                    ...filter,
                });
                return false;
            }
            return true;
        },
        [creatorFilter, newFilter, clearContestsList, getContests]
    );

    const parseParamsToUrl = filter => {
        const obj = {};
        Object.keys(filter).forEach(el => {
            if (filter[el]) obj[el] = filter[el];
        });
        navigate(`/Dashboard?${queryString.stringify(obj)}`);
    };

    const changePredicate = ({ name, value }) => {
        const newValue = value === 'Choose industry' ? null : value;
        newFilter({ [name]: newValue });

        parseParamsToUrl({
            ...creatorFilter,
            [name]: newValue,
        });
    };

    const getPredicateOfRequest = () => {
        const obj = {};
        Object.keys(creatorFilter).forEach(el => {
            if (creatorFilter[el]) obj[el] = creatorFilter[el];
        });
        obj.ownEntries = creatorFilter.ownEntries;
        obj.onlyActive = creatorFilter.onlyActive;
        return obj;
    };

    const loadMore = startFrom => {
        getContests({
            limit: 8,
            offset: startFrom,
            ...getPredicateOfRequest(),
        });
    };

    const tryLoadAgain = () => {
        clearContestsList();
        getContests({
            limit: 8,
            offset: 0,
            ...getPredicateOfRequest(),
        });
    };

    const toggleFilter = name => {
        const current = creatorFilter[name];
        changePredicate({ name, value: !current });
    };

    const goToExtended = contestId => navigate(`/contest/${contestId}`);

    const setContestList = () => {
        let filtered = contests;

        if (creatorFilter.onlyActive) {
            filtered = contests.filter(c => c.status === 'active');
        }

        return filtered.map(contest => (
            <ContestBox
                data={contest}
                key={contest.id}
                goToExtended={goToExtended}
            />
        ));
    };

    // === effects ===

    // заменяет componentDidMount
    useEffect(() => {
        getDataForContest();
        if (parseUrlForParams(location.search) && !contests.length) {
            getContests({
                limit: 8,
                offset: 0,
                ...creatorFilter,
            });
        }
    }, []);

    // заменяет componentWillReceiveProps
    useEffect(() => {
        parseUrlForParams(location.search);
    }, [location.search]);

    // === JSX ===

    const renderSelectType = () => {
        return (
            <select
                onChange={({ target }) =>
                    changePredicate({
                        name: 'typeIndex',
                        value: types.indexOf(target.value),
                    })
                }
                value={types[creatorFilter.typeIndex]}
                className={styles.input}
            >
                {types.slice(1).map((el, i) => (
                    <option key={i} value={el}>
                        {el}
                    </option>
                ))}
            </select>
        );
    };

    const renderIndustryType = () => {
        const { industry } = dataForContest.data;
        return (
            <select
                onChange={({ target }) =>
                    changePredicate({
                        name: 'industry',
                        value: target.value,
                    })
                }
                value={creatorFilter.industry}
                className={styles.input}
            >
                <option value={null}>Choose industry</option>
                {industry.map((ind, i) => (
                    <option key={i} value={ind}>
                        {ind}
                    </option>
                ))}
            </select>
        );
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.filterContainer}>
                <span className={styles.headerFilter}>Filter Results</span>
                <div className={styles.inputsContainer}>
                    <div
                        onClick={() => toggleFilter('ownEntries')}
                        className={classNames(styles.myEntries, {
                            [styles.activeMyEntries]: creatorFilter.ownEntries,
                        })}
                    >
                        My Entries
                    </div>
                    <div
                        onClick={() => toggleFilter('onlyActive')}
                        className={classNames(styles.myEntries, {
                            [styles.activeMyEntries]: creatorFilter.onlyActive,
                        })}
                    >
                        Only Active
                    </div>

                    <div className={styles.inputContainer}>
                        <span>By contest type</span>
                        {renderSelectType()}
                    </div>

                    <div className={styles.inputContainer}>
                        <span>By contest ID</span>
                        <input
                            type='text'
                            onChange={({ target }) =>
                                changePredicate({
                                    name: 'contestId',
                                    value: target.value,
                                })
                            }
                            name='contestId'
                            value={creatorFilter.contestId}
                            className={styles.input}
                        />
                    </div>

                    {!dataForContest.isFetching && (
                        <div className={styles.inputContainer}>
                            <span>By industry</span>
                            {renderIndustryType()}
                        </div>
                    )}

                    <div className={styles.inputContainer}>
                        <span>By amount award</span>
                        <select
                            onChange={({ target }) =>
                                changePredicate({
                                    name: 'awardSort',
                                    value: target.value,
                                })
                            }
                            value={creatorFilter.awardSort}
                            className={styles.input}
                        >
                            <option value='desc'>Descending</option>
                            <option value='asc'>Ascending</option>
                        </select>
                    </div>
                </div>
            </div>

            {error ? (
                <div className={styles.messageContainer}>
                    <TryAgain getData={tryLoadAgain} />
                </div>
            ) : (
                <ContestsContainer
                    isFetching={isFetching}
                    loadMore={loadMore}
                    haveMore={haveMore}
                >
                    {setContestList()}
                </ContestsContainer>
            )}
        </div>
    );
};

const mapStateToProps = state => {
    const { contestsList, dataForContest } = state;
    return { ...contestsList, dataForContest };
};

const mapDispatchToProps = dispatch => ({
    getContests: data =>
        dispatch(getContests({ requestData: data, role: CONSTANTS.CREATOR })),
    clearContestsList: () => dispatch(clearContestsList()),
    newFilter: filter => dispatch(setNewCreatorFilter(filter)),
    getDataForContest: () => dispatch(getDataForContest()),
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CreatorDashboard)
);
