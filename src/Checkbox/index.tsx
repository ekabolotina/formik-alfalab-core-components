import React, { FC, FocusEventHandler } from 'react';
import { useField } from 'formik';
import {
    Checkbox as CoreComponentsCheckbox,
    CheckboxProps as CoreComponentsCheckboxProps,
} from '@alfalab/core-components/checkbox';
import { useFieldOkState } from '../hooks/useFieldOkState';
import { SetRequired } from '../types/SetRequired';

export type CheckboxProps = SetRequired<CoreComponentsCheckboxProps, 'name'>;

//TODO: на стороне кора есть проблема с прокидыванием name
//https://github.com/core-ds/core-components/issues/1602
export const Checkbox: FC<CheckboxProps> = (props) => {
    const { name, onChange, ...restProps } = props;
    const [{ value, ...field }, , form] = useField({ name: 'field', type: 'checkbox' });
    const { error } = useFieldOkState(props);

    const handleChange: CheckboxProps['onChange'] = (event, payload) => {
        //TODO: после фикса в коре заменить на -  field.onChange(event)
        form.setValue(payload.checked);

        if (onChange) {
            onChange(event, payload);
        }
    };

    //TODO: после фикса в коре использовать хук - useFieldBlurState
    const handleBlur: FocusEventHandler = () => {
        form.setTouched(true);
    };

    return (
        <CoreComponentsCheckbox
            {...restProps}
            {...field}
            error={error}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
};
