import React, { useEffect, useCallback } from 'react';
import styles from './ContestContainer.module.sass';
import Spinner from '../Spinner/Spinner';

const ContestsContainer = ({ isFetching, haveMore, loadMore, children }) => {
    const scrollHandler = useCallback(() => {
        const reachedBottom =
            window.innerHeight + document.documentElement.scrollTop + 2 >=
            document.documentElement.offsetHeight;

        if (reachedBottom && haveMore && !isFetching) {
            loadMore(children.length);
        }
    }, [haveMore, isFetching, children.length, loadMore]);

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler);
        return () => window.removeEventListener('scroll', scrollHandler);
    }, [scrollHandler]);

    if (!isFetching && children.length === 0) {
        return <div className={styles.notFound}>Nothing found</div>;
    }

    return (
        <div>
            {children}
            {isFetching && (
                <div className={styles.spinnerContainer}>
                    <Spinner />
                </div>
            )}
        </div>
    );
};

export default ContestsContainer;
