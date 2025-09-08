import { useEffect, useState } from 'react';
import { intervalToDuration } from 'date-fns';
import styles from './EventItem.module.sass';
import CONSTANTS from '../../../constants';

export default function EventItem ({ event, onDelete }) {
    const eventDate = new Date(event.dateTime);
    const createdDate = new Date(event.createdAt);
    const totalTime = eventDate - createdDate;

    const [timeLeft, setTimeLeft] = useState(
        Math.max(eventDate - new Date(), 0)
    );
    const [notified, setNotified] = useState(event.notified);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diff = Math.max(eventDate - now, 0);
            setTimeLeft(diff);

            if (!notified && diff <= event.notifyBefore * 60 * 1000) {
                setNotified(true);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [eventDate, notified, event.notifyBefore]);

    const formatTime = ms => {
        if (ms <= 0) return '0s';

        const duration = intervalToDuration({ start: 0, end: ms });

        return [
            duration.years ? `${duration.years}y` : null,
            duration.months ? `${duration.months}mo` : null,
            duration.days ? `${duration.days}d` : null,
            duration.hours ? `${duration.hours}h` : null,
            duration.minutes ? `${duration.minutes}m` : null,
            `${duration.seconds ?? 0}s`,
        ]
            .filter(Boolean)
            .join(' ');
    };

    const elapsedTime = Math.max(new Date() - createdDate, 0);
    const progressPercent = totalTime
        ? Math.min(100, (elapsedTime / totalTime) * 100)
        : 100;

    const eventType = CONSTANTS.EVENT_TYPES.find(t => t.value === event.type);
    const typeClass = eventType ? styles[eventType.style] : styles.default;

    return (
        <li className={`${styles.item}`}>
            <div
                className={`${styles.progress} ${typeClass}`}
                style={{ width: `${progressPercent}%` }}
            />
            <div className={styles.content}>
                <span className={styles.name}>{event.name}</span>
                <div className={styles.timeWrapper}>
                    <span className={styles.time}>{formatTime(timeLeft)}</span>
                    {notified && <span className={styles.badge}>!</span>}
                    <button
                        onClick={() => onDelete(event.id)}
                        className={styles.delete}
                        aria-label='Delete'
                    >
                        ×
                    </button>
                </div>
            </div>
        </li>
    );
}
