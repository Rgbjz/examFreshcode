import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllOffers,
    setOfferStatusModerator,
    clearModeratorOffersError,
} from '../../store/slices/moderatorOffersSlice';
import CONSTANTS from '../../constants';
import styles from './ModeratorPage.module.sass';

const ModeratorPage = () => {
    const dispatch = useDispatch();
    const { offers, isFetching, pagination, error, updateStatusError } =
        useSelector(state => state.moderatorOffers);

    const [selectedOffer, setSelectedOffer] = useState(null);

    useEffect(() => {
        dispatch(getAllOffers({ page: pagination.page }));
    }, [dispatch, pagination.page]);

    const handleStatusChange = async (id, status) => {
        const resultAction = await dispatch(
            setOfferStatusModerator({ id, status })
        );

        if (setOfferStatusModerator.fulfilled.match(resultAction)) {
            const updatedOffers = offers.filter(offer => offer.id !== id);
            dispatch({
                type: 'moderatorOffers/setOffersManually',
                payload: updatedOffers,
            });
        }
    };

    const handlePageChange = page => {
        dispatch(getAllOffers({ page }));
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Moderator Dashboard</h1>

            {error && (
                <div className={styles.error}>
                    {error.message || 'Failed to load offers'}
                    <button
                        className={styles.dismissBtn}
                        onClick={() => dispatch(clearModeratorOffersError())}
                    >
                        ×
                    </button>
                </div>
            )}

            {updateStatusError && (
                <div className={styles.error}>
                    {updateStatusError.message || 'Failed to update status'}
                    <button
                        className={styles.dismissBtn}
                        onClick={() => dispatch(clearModeratorOffersError())}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className={styles.tableWrapper}>
                {isFetching ? (
                    <div className={styles.loader}>Loading...</div>
                ) : offers.length === 0 ? (
                    <div className={styles.empty}>🎉 No offers to moderate</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Contest</th>
                                <th>Text</th>
                                <th>File</th>
                                <th>Status</th>
                                <th>Details</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.map(offer => (
                                <tr key={offer.id}>
                                    <td>{offer.id}</td>
                                    <td>{offer.Contest?.title || '—'}</td>
                                    <td>{offer.text}</td>
                                    <td>
                                        {offer.fileName ? (
                                            <a
                                                href={`${CONSTANTS.publicURL}${offer.fileName}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                View File
                                            </a>
                                        ) : (
                                            'No File'
                                        )}
                                    </td>
                                    <td className={styles.status}>
                                        {offer.status}
                                    </td>
                                    <td>
                                        <button
                                            className={styles.detailsBtn}
                                            onClick={() =>
                                                setSelectedOffer(offer)
                                            }
                                        >
                                            View
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className={`${styles.btn} ${styles.approveBtn}`}
                                            onClick={() =>
                                                handleStatusChange(
                                                    offer.id,
                                                    'approved'
                                                )
                                            }
                                        >
                                            ✅
                                        </button>
                                        <button
                                            className={`${styles.btn} ${styles.declineBtn}`}
                                            onClick={() =>
                                                handleStatusChange(
                                                    offer.id,
                                                    'declined'
                                                )
                                            }
                                        >
                                            ❌
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                    {Array.from({ length: pagination.totalPages }).map(
                        (_, index) => (
                            <button
                                key={index}
                                className={`${styles.pageBtn} ${
                                    pagination.page === index + 1
                                        ? styles.activePage
                                        : ''
                                }`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        )
                    )}
                </div>
            )}

            {selectedOffer && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Contest Details</h2>

                        <p>
                            <b>Contest Title:</b> {selectedOffer.Contest.title}
                        </p>
                        <p>
                            <b>Contest Type:</b>{' '}
                            {selectedOffer.Contest.contestType}
                        </p>
                        <p>
                            <b>Industry:</b> {selectedOffer.Contest.industry}
                        </p>
                        <p>
                            <b>Style:</b>{' '}
                            {selectedOffer.Contest.styleName ||
                                selectedOffer.Contest.brandStyle}
                        </p>
                        <p>
                            <b>Business Focus:</b>{' '}
                            {selectedOffer.Contest.focusOfWork || '—'}
                        </p>
                        <p>
                            <b>Target Audience:</b>{' '}
                            {selectedOffer.Contest.targetCustomer || '—'}
                        </p>

                        <button
                            className={styles.closeModal}
                            onClick={() => setSelectedOffer(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModeratorPage;
