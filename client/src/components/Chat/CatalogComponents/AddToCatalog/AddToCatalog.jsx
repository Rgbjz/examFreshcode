import React from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import SelectInput from '../../../SelectInput/SelectInput';
import { addChatToCatalog } from '../../../../store/slices/chatSlice';
import styles from './AddToCatalog.module.sass';

const AddToCatalog = ({ catalogList }) => {
    const dispatch = useDispatch();
    const addChatId = useSelector(state => state.chatStore.selectedChatId);
    const currentCatalog = useSelector(state => state.chatStore.currentCatalog);

    const handleSubmit = (values, { resetForm }) => {
        if (!addChatId || !values.catalogId) return;

        dispatch(
            addChatToCatalog({
                chatId: addChatId,
                catalogId: values.catalogId,
            })
        ).then(action => {
            if (action.payload) {
                if (currentCatalog && currentCatalog.id === action.payload.id) {
                    currentCatalog.chats = [
                        ...new Set(
                            action.payload.chats.map(c => (c.id ? c.id : c))
                        ),
                    ];
                }
            }
        });

        resetForm();
    };

    const selectArray = catalogList.map(c => c.catalogName);
    const valueArray = catalogList.map(c => c.id);

    if (!selectArray.length) {
        return (
            <div className={styles.notFound}>
                You have not created any directories.
            </div>
        );
    }

    return (
        <Formik initialValues={{ catalogId: '' }} onSubmit={handleSubmit}>
            {({ setFieldValue, values }) => (
                <Form className={styles.form}>
                    <SelectInput
                        name='catalogId'
                        header='Name of catalog'
                        classes={{
                            inputContainer: styles.selectInputContainer,
                            inputHeader: styles.selectHeader,
                            selectInput: styles.select,
                        }}
                        optionsArray={selectArray}
                        valueArray={valueArray}
                        value={values.catalogId}
                        onChange={value => setFieldValue('catalogId', value)}
                    />
                    <button
                        type='submit'
                        className={styles.addButton}
                        onClick={e => e.stopPropagation()}
                    >
                        Add
                    </button>
                </Form>
            )}
        </Formik>
    );
};

const mapStateToProps = state => ({
    catalogList: state.chatStore.catalogList,
});

export default connect(mapStateToProps)(AddToCatalog);
