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
    success?: boolean;
};

export function useFieldOkState(inputProps: InputProps): ReturnValue {
    const [field, meta] = useField(inputProps);
    const { error: formikError, touched } = meta;
    const { error: initialError, success: initialSuccess } = inputProps;
    const error = initialError ?? formikError;
    const success = initialSuccess ?? !error;

    return {
        error: touched && error,
        success: !!field.value && success,
    };
}
