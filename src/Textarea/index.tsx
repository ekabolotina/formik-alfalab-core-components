import React, { FC } from 'react';
import {
    Textarea as CoreComponentsTextarea,
    TextareaProps as CoreComponentsTextareaProps,
} from '@alfalab/core-components/textarea';
import { useField } from 'formik';
import { useFieldBlurState } from '../hooks/useFieldBlurState';
import { useFieldOkState } from '../hooks/useFieldOkState';
import { SetRequired } from '../types/SetRequired';

export type TextareaProps = SetRequired<CoreComponentsTextareaProps, 'name'>;

export const Textarea: FC<TextareaProps> = (props) => {
    // TODO: Maybe use `useInputFieldState` hook
    const { name, onChange, ...restProps } = props;
    const blurState = useFieldBlurState(props);
    const { error } = useFieldOkState(props);
    const [field, , form] = useField(name);

    const handleChange: TextareaProps['onChange'] = (event, payload) => {
        form.setValue(payload.value);

        if (onChange) {
            onChange(event, payload);
        }
    };

    return (
        <CoreComponentsTextarea
            {...restProps}
            {...field}
            {...blurState}
            error={error}
            onChange={handleChange}
        />
    );
};
