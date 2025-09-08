import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import CONSTANTS from '../../../constants';
import styles from './EventForm.module.sass';

const EventSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must be at most 50 characters')
        .required('Event name is required'),
    date: Yup.date()
        .typeError('Invalid date format')
        .required('Date is required'),
    time: Yup.string().required('Time is required'),
    notifyBefore: Yup.number()
        .typeError('Must be a number')
        .min(0, 'Must be greater or equal to 0')
        .max(1440, 'Cannot be more than 1440 minutes (24h)')
        .required('Notify Before is required'),
    type: Yup.string()
        .oneOf(
            CONSTANTS.EVENT_TYPES.map(t => t.value),
            'Invalid event type'
        )
        .required('Event type is required'),
});

export default function EventForm ({ onAdd }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h3 className={styles.title}>Add New Event</h3>
            </div>

            <Formik
                initialValues={{
                    name: '',
                    date: '',
                    time: '',
                    notifyBefore: 0,
                    type: 'custom',
                }}
                validationSchema={EventSchema}
                onSubmit={(values, { resetForm }) => {
                    const dateTimeString = `${values.date}T${values.time}`;
                    const dateTime = new Date(dateTimeString);

                    if (isNaN(dateTime.getTime())) {
                        alert('Invalid date or time!');
                        return;
                    }

                    onAdd({
                        id: uuidv4(),
                        name: values.name,
                        dateTime: dateTime.toISOString(),
                        createdAt: new Date().toISOString(),
                        notifyBefore: Number(values.notifyBefore),
                        type: values.type,
                        notified: false,
                    });

                    resetForm();
                }}
            >
                {() => (
                    <Form className={styles.form}>
                        <div className={styles.group}>
                            <label htmlFor='name'>Event Name</label>
                            <Field
                                id='name'
                                name='name'
                                className={styles.input}
                                placeholder='Enter event name'
                            />
                            <ErrorMessage
                                name='name'
                                component='div'
                                className={styles.error}
                            />
                        </div>

                        <div className={styles.group}>
                            <label htmlFor='type'>Type</label>
                            <Field
                                as='select'
                                id='type'
                                name='type'
                                className={styles.input}
                            >
                                {CONSTANTS.EVENT_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage
                                name='type'
                                component='div'
                                className={styles.error}
                            />
                        </div>

                        <div className={styles.group}>
                            <label htmlFor='date'>Date</label>
                            <Field
                                id='date'
                                name='date'
                                type='date'
                                className={styles.input}
                            />
                            <ErrorMessage
                                name='date'
                                component='div'
                                className={styles.error}
                            />
                        </div>

                        <div className={styles.group}>
                            <label htmlFor='time'>Time</label>
                            <Field
                                id='time'
                                name='time'
                                type='time'
                                className={styles.input}
                            />
                            <ErrorMessage
                                name='time'
                                component='div'
                                className={styles.error}
                            />
                        </div>

                        <div className={styles.group}>
                            <label htmlFor='notifyBefore'>
                                Notify Before (minutes)
                            </label>
                            <Field
                                id='notifyBefore'
                                name='notifyBefore'
                                type='number'
                                min='0'
                                className={styles.input}
                            />
                            <ErrorMessage
                                name='notifyBefore'
                                component='div'
                                className={styles.error}
                            />
                        </div>

                        <button type='submit' className={styles.submit}>
                            Add Event
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
