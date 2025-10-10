import React from 'react';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import {
    changeShowModeCatalog,
    changeRenameCatalogMode,
    changeCatalogName as dispatchChangeCatalogName,
} from '../../../../store/slices/chatSlice';
import styles from './CatalogHeader.module.sass';
import FormInput from '../../../FormInput/FormInput';
import Schems from '../../../../utils/validators/validationSchems';

const CatalogListHeader = props => {
    const handleChangeCatalogName = values => {
        const { _id } = props;
        props.changeCatalogName({
            catalogName: values.catalogName,
            catalogId: _id,
        });
    };

    const {
        catalogName,
        changeShowModeCatalog,
        changeRenameCatalogMode,
        isRenameCatalog,
    } = props;

    return (
        <div className={styles.headerContainer}>
            <i
                className='fas fa-long-arrow-alt-left'
                onClick={() => changeShowModeCatalog()}
            />
            {!isRenameCatalog && (
                <div className={styles.infoContainer}>
                    <span>{catalogName}</span>
                    <i
                        className='fas fa-edit'
                        onClick={() => changeRenameCatalogMode()}
                    />
                </div>
            )}
            {isRenameCatalog && (
                <div className={styles.changeContainer}>
                    <Formik
                        onSubmit={handleChangeCatalogName}
                        initialValues={props.initialValues}
                        validationSchema={Schems.CatalogSchema}
                    >
                        <Form>
                            <FormInput
                                name='catalogName'
                                classes={{
                                    container: styles.inputContainer,
                                    input: styles.input,
                                    warning: styles.fieldWarning,
                                    notValid: styles.notValid,
                                }}
                                type='text'
                                label='Catalog Name'
                            />
                            <button type='submit'>Change</button>
                        </Form>
                    </Formik>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => {
    const { isRenameCatalog, currentCatalog } = state.chatStore;
    return {
        _id: currentCatalog?.id,
        catalogName: currentCatalog?.catalogName,
        isRenameCatalog,
        initialValues: {
            catalogName: currentCatalog?.catalogName || '',
        },
    };
};

const mapDispatchToProps = dispatch => ({
    changeShowModeCatalog: () => dispatch(changeShowModeCatalog()),
    changeRenameCatalogMode: () => dispatch(changeRenameCatalogMode()),
    changeCatalogName: data => dispatch(dispatchChangeCatalogName(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogListHeader);
