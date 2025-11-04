import { useEffect, useState, useRef } from 'react';
import { intervalToDuration } from 'date-fns';
import styles from './EventItem.module.sass';
import CONSTANTS from '../../../constants';

export default function EventItem ({ event, onDelete, onEdit }) {
    const eventDate = new Date(event.dateTime);
    const createdDate = new Date(event.createdAt);

    const [timeLeft, setTimeLeft] = useState(
        Math.max(eventDate - new Date(), 0)
    );
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimeLeft(Math.max(eventDate - new Date(), 0));
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [eventDate]);

    const formatTime = ms => {
        if (ms <= 0) return '0s';
        const d = intervalToDuration({ start: 0, end: ms });
        return [
            d.days && `${d.days}d`,
            d.hours && `${d.hours}h`,
            d.minutes && `${d.minutes}m`,
            `${d.seconds ?? 0}s`,
        ]
            .filter(Boolean)
            .join(' ');
    };

    const total = eventDate - createdDate;
    const elapsed = Math.max(new Date() - createdDate, 0);
    const progress = total ? Math.min(100, (elapsed / total) * 100) : 100;

    const type = CONSTANTS.EVENT_TYPES.find(t => t.value === event.type);
    const typeClass = type ? styles[type.style] : styles.default;

    return (
        <li className={styles.item}>
            <div
                className={`${styles.progress} ${typeClass}`}
                style={{ width: `${progress}%` }}
            />

            <div className={styles.content}>
                <span className={styles.name}>{event.name}</span>

                <div className={styles.timeWrapper}>
                    <span className={styles.time}>{formatTime(timeLeft)}</span>

                    <button
                        onClick={() => onEdit(event)}
                        className={styles.edit}
                    >
                        ✎
                    </button>

                    <button
                        onClick={() => onDelete(event.id)}
                        className={styles.delete}
                    >
                        ×
                    </button>
                </div>
            </div>
        </li>
    );
}
