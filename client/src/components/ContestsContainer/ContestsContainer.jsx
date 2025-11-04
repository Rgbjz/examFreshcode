import React, { useEffect, useCallback } from 'react';
import styles from './ContestContainer.module.sass';
import Spinner from '../Spinner/Spinner';

const ContestsContainer = ({ isFetching, haveMore, loadMore, children }) => {
    const scrollHandler = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight
        ) {
            if (haveMore) {
                loadMore(children.length);
            }
        }
    }, [haveMore, loadMore, children]);

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler);

        return () => {
            window.removeEventListener('scroll', scrollHandler);
        };
    }, [scrollHandler]);

    if (!isFetching && children.length === 0) {
        return <div className={styles.notFound}>Nothing not found</div>;
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
