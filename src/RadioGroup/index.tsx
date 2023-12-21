import React, { FC, FocusEventHandler } from 'react';
import { useField } from 'formik';
import {
    RadioGroup as CoreComponentsRadioGroup,
    RadioGroupProps as CoreComponentsRadioGroupProps,
} from '@alfalab/core-components/radio-group';
import { useFieldOkState } from '../hooks/useFieldOkState';
import { SetRequired } from '../types/SetRequired';

export type RadioGroupProps = SetRequired<CoreComponentsRadioGroupProps, 'name'>;

export const RadioGroup: FC<RadioGroupProps> = (props) => {
    const { name, children, onChange, ...restProps } = props;
    const [field, , form] = useField(name);
    const { error } = useFieldOkState(props);

    const handleChange: RadioGroupProps['onChange'] = (event, payload) => {
        form.setValue(payload?.value);

        if (onChange) {
            onChange(event, payload);
        }
    };

    const handleBlur: FocusEventHandler = () => {
        form.setTouched(true);
    };

    return (
        <CoreComponentsRadioGroup
            {...restProps}
            {...field}
            error={error}
            onChange={handleChange}
            onBlur={handleBlur}
        >
            {children}
        </CoreComponentsRadioGroup>
    );
};
