import { ReactNode } from 'react';
import { useField } from 'formik';

type Error = ReactNode | boolean;

type ReturnValue = {
    error: Error;
    success: boolean;
};

type InputProps = {
    name: string;
    error?: Error;
};

export function useFieldOkState(inputProps: InputProps): ReturnValue {
    const [field, meta] = useField(inputProps);
    const { error: formikError, touched } = meta;
    const error = inputProps.error || formikError;

    return {
        error: touched && error,
        success: !!field.value && !error,
    };
}
