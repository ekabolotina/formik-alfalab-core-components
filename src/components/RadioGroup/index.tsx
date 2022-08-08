import React, { FC, Children, cloneElement, isValidElement } from 'react';
import { SetRequired } from 'type-fest';
import { useField } from 'formik';
import {
    RadioGroup as CoreComponentsRadioGroup,
    RadioGroupProps as CoreComponentsRadioGroupProps,
} from '@alfalab/core-components/radio-group';
import { useFieldOkState } from '../../hooks/useFieldOkState';
import { useFieldBlurState } from '../../hooks/useFieldBlurState';

export type RadioGroupProps = SetRequired<CoreComponentsRadioGroupProps, 'name'>;

/**
 * The `touched` state is not managed for now.
 *
 * @see https://github.com/core-ds/core-components/issues/186
 * */
export const RadioGroup: FC<RadioGroupProps> = (props) => {
    const { name, children, onChange, ...restProps } = props;
    const [field, , form] = useField(name);
    const { error } = useFieldOkState(props);
    const blurState = useFieldBlurState(props);

    const handleChange: RadioGroupProps['onChange'] = (event, payload) => {
        form.setValue(payload?.value);

        if (onChange) {
            onChange(event, payload);
        }
    };

    return (
        <CoreComponentsRadioGroup {...restProps} {...field} error={error} onChange={handleChange}>
            {/* Maybe pass `blurState` to `CoreComponentsRadioGroup` after issue will be resoled — https://github.com/core-ds/core-components/issues/186 */}
            {Children.map(children, (child) =>
                isValidElement(child) ? cloneElement(child, blurState) : child,
            )}
        </CoreComponentsRadioGroup>
    );
};
