import React from 'react';
import { Field, useFormikContext } from 'formik';

const FieldFileInput = ({ classes, ...rest }) => {
    const { setFieldValue } = useFormikContext();
    const { fileUploadContainer, labelClass, fileNameClass, fileInput } =
        classes;

    return (
        <Field name={rest.name}>
            {({ field }) => {
                const getFileName = () => {
                    if (field.value instanceof File) {
                        return field.value.name;
                    }
                    return '';
                };

                const handleChange = e => {
                    const file = e.currentTarget.files[0] || null;
                    setFieldValue(rest.name, file); // ⬅️ вот ключевая часть
                };

                return (
                    <div className={fileUploadContainer}>
                        <label htmlFor={rest.name} className={labelClass}>
                            Choose file
                        </label>
                        <span id='fileNameContainer' className={fileNameClass}>
                            {getFileName()}
                        </span>
                        <input
                            id={rest.name}
                            name={rest.name}
                            type='file'
                            className={fileInput}
                            onChange={handleChange}
                        />
                    </div>
                );
            }}
        </Field>
    );
};

export default FieldFileInput;
