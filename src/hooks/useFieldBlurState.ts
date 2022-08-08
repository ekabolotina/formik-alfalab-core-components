import { FocusEventHandler } from 'react';
import { useField } from 'formik';

type ReturnValue = {
    onBlur: FocusEventHandler;
};

type InputProps = {
    name: string;
    onBlur?: FocusEventHandler;
};

export function useFieldBlurState(inputProps: InputProps): ReturnValue {
    const { onBlur } = inputProps;
    const [field] = useField(inputProps);

    const handleBlur: FocusEventHandler = (event) => {
        field.onBlur(event);

        if (onBlur) {
            onBlur(event);
        }
    };

    return {
        onBlur: handleBlur,
    };
}
