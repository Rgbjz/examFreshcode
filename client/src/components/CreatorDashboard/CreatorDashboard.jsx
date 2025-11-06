import React, { useEffect } from 'react';
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

const DEFAULT_FILTER = {
    typeIndex: 1,
    contestId: '',
    industry: '',
    awardSort: 'asc',
    ownEntries: false,
    onlyActive: false,
};

const parseSearchToFilter = search => {
    const obj = queryString.parse(search);
    return {
        typeIndex: obj.typeIndex
            ? Number(obj.typeIndex)
            : DEFAULT_FILTER.typeIndex,
        contestId: obj.contestId || '',
        industry: obj.industry || '',
        awardSort: obj.awardSort || 'asc',
        ownEntries: obj.ownEntries === 'true',
        onlyActive: obj.onlyActive === 'true',
    };
};

const buildSearchFromFilter = filter => {
    const obj = {
        typeIndex: filter.typeIndex,
        contestId: filter.contestId || undefined,
        industry: filter.industry || undefined,
        awardSort: filter.awardSort || undefined,
        ownEntries: filter.ownEntries ? 'true' : undefined,
        onlyActive: filter.onlyActive ? 'true' : undefined,
    };
    return queryString.stringify(obj);
};

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
    useEffect(() => {
        getDataForContest();

        const filterFromUrl = parseSearchToFilter(location.search);
        newFilter(filterFromUrl);

        clearContestsList();
        getContests({
            limit: 8,
            offset: 0,
            ...filterFromUrl,
        });
    }, []);

    useEffect(() => {
        const filterFromUrl = parseSearchToFilter(location.search);

        if (!isEqual(filterFromUrl, creatorFilter)) {
            newFilter(filterFromUrl);
            clearContestsList();
            getContests({
                limit: 8,
                offset: 0,
                ...filterFromUrl,
            });
        }
    }, [location.search]);

    const changePredicate = ({ name, value }) => {
        const newValue = value === 'Choose industry' ? '' : value;
        const updated = { ...creatorFilter, [name]: newValue };
        const search = buildSearchFromFilter(updated);
        navigate(`/Dashboard?${search}`);
    };

    const toggleFilter = name => {
        changePredicate({ name, value: !creatorFilter[name] });
    };

    const goToExtended = id => navigate(`/contest/${id}`);

    const loadMore = offset => {
        getContests({
            limit: 8,
            offset,
            ...creatorFilter,
        });
    };

    const filteredContests = creatorFilter.onlyActive
        ? contests.filter(c => c.status === 'active')
        : contests;

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
                        <select
                            onChange={({ target }) =>
                                changePredicate({
                                    name: 'typeIndex',
                                    value: Number(types.indexOf(target.value)),
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
                    </div>

                    <div className={styles.inputContainer}>
                        <span>By contest ID</span>
                        <input
                            type='text'
                            value={creatorFilter.contestId}
                            onChange={({ target }) =>
                                changePredicate({
                                    name: 'contestId',
                                    value: target.value,
                                })
                            }
                            className={styles.input}
                        />
                    </div>

                    {!dataForContest.isFetching && (
                        <div className={styles.inputContainer}>
                            <span>By industry</span>
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
                                <option value=''>Choose industry</option>
                                {dataForContest.data.industry.map((ind, i) => (
                                    <option key={i} value={ind}>
                                        {ind}
                                    </option>
                                ))}
                            </select>
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
                    <TryAgain getData={() => loadMore(0)} />
                </div>
            ) : (
                <ContestsContainer
                    isFetching={isFetching}
                    loadMore={loadMore}
                    haveMore={haveMore}
                >
                    {filteredContests.map(c => (
                        <ContestBox
                            key={c.id}
                            data={c}
                            goToExtended={goToExtended}
                        />
                    ))}
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
    newFilter: f => dispatch(setNewCreatorFilter(f)),
    getDataForContest: () => dispatch(getDataForContest()),
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CreatorDashboard)
);
