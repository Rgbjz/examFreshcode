import { FaRegClock } from 'react-icons/fa';
import EventItem from '../EventItem/EventItem';
import styles from './EventList.module.sass';

export default function EventList ({ events, onDelete }) {
    const now = new Date();

    const sortedEvents = [...events].sort((a, b) => {
        const timeA = new Date(a.dateTime) - now;
        const timeB = new Date(b.dateTime) - now;
        return timeA - timeB;
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h3 className={styles.title}>Live upcoming checks</h3>
                <div>
                    <span className={styles.subtitle}>Remaining time</span>
                    <FaRegClock className={styles.clockIcon} />
                </div>
            </div>

            {sortedEvents.length === 0 ? (
                <p className={styles.empty}>No events yet</p>
            ) : (
                <ul className={styles.list}>
                    {sortedEvents.map(event => (
                        <EventItem
                            key={event.id}
                            event={event}
                            onDelete={onDelete}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
