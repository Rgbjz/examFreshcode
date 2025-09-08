import { useState, useEffect } from 'react';
import EventForm from '../../components/EventComponents/EventForm/EventForm';
import EventList from '../../components/EventComponents/EventList/EventList';
import styles from './EventPage.module.sass';

export default function EventPage () {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('events');
        if (saved) {
            setEvents(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('events', JSON.stringify(events));
    }, [events]);

    const addEvent = newEvent => {
        setEvents(prev =>
            [...prev, newEvent].sort(
                (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
            )
        );
    };

    const deleteEvent = id => {
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    return (
        <div className={styles.EventPage}>
            <EventForm onAdd={addEvent} />
            <EventList events={events} onDelete={deleteEvent} />
        </div>
    );
}
