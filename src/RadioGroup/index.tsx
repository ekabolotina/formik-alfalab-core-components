import React, { FC, Children, cloneElement, isValidElement, FocusEventHandler } from 'react';
import { SetRequired } from 'type-fest';
import { useField } from 'formik';
import {
    RadioGroup as CoreComponentsRadioGroup,
    RadioGroupProps as CoreComponentsRadioGroupProps,
} from '@alfalab/core-components/radio-group';
import { useFieldOkState } from '../hooks/useFieldOkState';

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
        <CoreComponentsRadioGroup {...restProps} {...field} error={error} onChange={handleChange}>
            {/* Maybe pass `blur` event handler to `CoreComponentsRadioGroup` after issue will be resolved — https://github.com/core-ds/core-components/issues/186 */}
            {Children.map(children, (child) =>
                isValidElement(child) ? cloneElement(child, { onBlur: handleBlur }) : child,
            )}
        </CoreComponentsRadioGroup>
    );
};
