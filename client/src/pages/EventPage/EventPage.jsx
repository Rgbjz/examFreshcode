import { useState } from 'react';
import EventForm from '../../components/EventComponents/EventForm/EventForm';
import EventList from '../../components/EventComponents/EventList/EventList';
import styles from './EventPage.module.sass';

export default function EventPage ({ events, setEvents }) {
    const [editingEvent, setEditingEvent] = useState(null);

    const addEvent = event => {
        setEvents(prev =>
            [...prev, event].sort(
                (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
            )
        );
    };

    const deleteEvent = id => setEvents(prev => prev.filter(e => e.id !== id));

    const updateEvent = updated => {
        setEvents(prev => prev.map(e => (e.id === updated.id ? updated : e)));
        setEditingEvent(null);
    };

    return (
        <div className={styles.EventPage}>
            <EventForm
                onAdd={addEvent}
                onEdit={updateEvent}
                editingEvent={editingEvent}
                cancelEdit={() => setEditingEvent(null)}
            />

            <EventList
                events={events}
                onDelete={deleteEvent}
                onUpdate={updateEvent}
                onEdit={setEditingEvent}
            />
        </div>
    );
}
