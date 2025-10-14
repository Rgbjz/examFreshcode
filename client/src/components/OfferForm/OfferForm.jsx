// OfferForm.jsx
import React from 'react';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import CONTANTS from '../../constants';
import {
    addOffer,
    clearAddOfferError,
} from '../../store/slices/contestByIdSlice';
import styles from './OfferForm.module.sass';
import ImageUpload from '../InputComponents/ImageUpload/ImageUpload';
import FormInput from '../FormInput/FormInput';
import Schems from '../../utils/validators/validationSchems';
import Error from '../Error/Error';

const OfferForm = props => {
    const {
        contestId,
        contestType,
        customerId,
        addOfferError,
        clearOfferError,
    } = props;

    // Рендерим поля в зависимости от типа конкурса
    const renderOfferInput = () => {
        if (contestType === CONTANTS.LOGO_CONTEST) {
            return (
                <>
                    <ImageUpload
                        name='offerData'
                        classes={{
                            uploadContainer: styles.imageUploadContainer,
                            inputContainer: styles.uploadInputContainer,
                            imgStyle: styles.imgStyle,
                        }}
                    />
                    <FormInput
                        name='text'
                        classes={{
                            container: styles.inputContainer,
                            input: styles.input,
                            warning: styles.fieldWarning,
                            notValid: styles.notValid,
                        }}
                        type='text'
                        label='your text'
                    />
                </>
            );
        }

        return (
            <FormInput
                name='offerData'
                classes={{
                    container: styles.inputContainer,
                    input: styles.input,
                    warning: styles.fieldWarning,
                    notValid: styles.notValid,
                }}
                type='text'
                label='your suggestion'
            />
        );
    };

    // Отправка формы
    const setOffer = (values, { resetForm }) => {
        clearOfferError();
        const data = new FormData();
        data.append('contestId', contestId);
        data.append('contestType', contestType);
        data.append('offerData', values.offerData);
        data.append('customerId', customerId);

        if (contestType === CONTANTS.LOGO_CONTEST && values.text) {
            data.append('offerText', values.text);
        }

        props.setNewOffer(data);
        resetForm();
    };

    // Валидаторы
    const validationSchema =
        contestType === CONTANTS.LOGO_CONTEST
            ? Schems.LogoOfferSchema
            : Schems.TextOfferSchema;

    // Начальные значения формы
    const initialValues =
        contestType === CONTANTS.LOGO_CONTEST
            ? { offerData: '', text: '' }
            : { offerData: '' };

    return (
        <div className={styles.offerContainer}>
            {addOfferError && (
                <Error
                    data={addOfferError.data}
                    status={addOfferError.status}
                    clearError={clearOfferError}
                />
            )}
            <Formik
                onSubmit={setOffer}
                initialValues={initialValues}
                validationSchema={validationSchema}
            >
                {({ isValid, isSubmitting }) => (
                    <Form className={styles.form}>
                        {renderOfferInput()}
                        <button
                            type='submit'
                            className={styles.btnOffer}
                            disabled={!isValid || isSubmitting}
                        >
                            Send Offer
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    setNewOffer: data => dispatch(addOffer(data)),
    clearOfferError: () => dispatch(clearAddOfferError()),
});

const mapStateToProps = state => {
    const { addOfferError } = state.contestByIdStore;
    return { addOfferError };
};

export default connect(mapStateToProps, mapDispatchToProps)(OfferForm);
