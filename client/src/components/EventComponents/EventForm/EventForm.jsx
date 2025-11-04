import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import CONSTANTS from '../../../constants';
import styles from './EventForm.module.sass';

export default function EventForm ({ onAdd, onEdit, editingEvent, cancelEdit }) {
    // current date/time in local ISO format
    const pad = n => (n < 10 ? `0${n}` : n);
    const now = new Date();
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        now.getDate()
    )}`;
    const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const EventSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, 'Name must be at least 3 characters')
            .max(50, 'Name must be at most 50 characters')
            .required('Event name is required'),

        date: Yup.string().required('Date is required'),

        time: Yup.string()
            .required('Time is required')
            .test('not-in-past', 'Cannot be in the past', function (value) {
                const { date } = this.parent;
                if (!date || !value) return true;

                const selected = new Date(`${date}T${value}`);
                return selected >= new Date();
            }),

        notifyBefore: Yup.number()
            .typeError('Must be a number')
            .min(0, 'Must be >= 0')
            .max(1440, 'Max 1440 minutes')
            .required('Notify Before is required'),

        type: Yup.string()
            .oneOf(CONSTANTS.EVENT_TYPES.map(t => t.value))
            .required('Event type is required'),
    });

    const initialValues = editingEvent
        ? {
              name: editingEvent.name,
              date: editingEvent.dateTime.slice(0, 10),
              time: editingEvent.dateTime.slice(11, 16),
              notifyBefore: editingEvent.notifyBefore,
              type: editingEvent.type,
          }
        : { name: '', date: '', time: '', notifyBefore: 0, type: 'custom' };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
            </div>

            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={EventSchema}
                onSubmit={(values, { resetForm }) => {
                    const dateTime = new Date(`${values.date}T${values.time}`);

                    if (dateTime < new Date()) {
                        alert('Cannot set time in the past!');
                        return;
                    }

                    const eventData = {
                        id: editingEvent?.id || uuidv4(),
                        name: values.name,
                        dateTime: dateTime.toISOString(),
                        createdAt:
                            editingEvent?.createdAt || new Date().toISOString(),
                        notifyBefore: Number(values.notifyBefore),
                        type: values.type,
                        notifiedBefore: false,
                        notifiedStart: false,
                    };

                    editingEvent ? onEdit(eventData) : onAdd(eventData);
                    resetForm();
                }}
            >
                {({ values }) => {
                    const isToday = values.date === today;
                    const timeMin = isToday ? currentTime : undefined;

                    return (
                        <Form className={styles.form}>
                            <div className={styles.group}>
                                <label>Event Name</label>
                                <Field className={styles.input} name='name' />
                                <ErrorMessage
                                    name='name'
                                    className={styles.error}
                                    component='div'
                                />
                            </div>

                            <div className={styles.group}>
                                <label>Type</label>
                                <Field
                                    as='select'
                                    name='type'
                                    className={styles.input}
                                >
                                    {CONSTANTS.EVENT_TYPES.map(t => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </Field>
                            </div>

                            <div className={styles.group}>
                                <label>Date</label>
                                <Field
                                    type='date'
                                    name='date'
                                    className={styles.input}
                                />
                                <ErrorMessage
                                    name='date'
                                    className={styles.error}
                                    component='div'
                                />
                            </div>

                            <div className={styles.group}>
                                <label>Time</label>
                                <Field
                                    type='time'
                                    name='time'
                                    className={styles.input}
                                    {...(timeMin ? { min: timeMin } : {})}
                                />
                                <ErrorMessage
                                    name='time'
                                    className={styles.error}
                                    component='div'
                                />
                            </div>

                            <div className={styles.group}>
                                <label>Notify Before (minutes)</label>
                                <Field
                                    type='number'
                                    name='notifyBefore'
                                    min='0'
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.actions}>
                                <button type='submit' className={styles.submit}>
                                    {editingEvent
                                        ? 'Save Changes'
                                        : 'Add Event'}
                                </button>

                                {editingEvent && (
                                    <button
                                        type='button'
                                        onClick={cancelEdit}
                                        className={styles.cancel}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
