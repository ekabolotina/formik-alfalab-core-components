import React, { FC } from 'react';
import { SetRequired } from 'type-fest';
import { useField } from 'formik';
import {
    AmountInput as CoreComponentsAmountInput,
    AmountInputProps as CoreComponentsAmountInputProps,
} from '@alfalab/core-components/amount-input';
import { useFieldOkState } from '../../hooks/useFieldOkState';
import { useFieldBlurState } from '../../hooks/useFieldBlurState';

export type AmountInputProps = SetRequired<CoreComponentsAmountInputProps, 'name'>;

export const AmountInput: FC<AmountInputProps> = (props) => {
    const { name, onChange, ...restProps } = props;
    const [field, , form] = useField(name);
    const okState = useFieldOkState(props);
    const blurState = useFieldBlurState(props);

    const handleChange: AmountInputProps['onChange'] = (event, payload) => {
        form.setValue(payload.value);

        if (onChange) {
            onChange(event, payload);
        }
    };

    return (
        <CoreComponentsAmountInput
            {...restProps}
            {...field}
            {...blurState}
            {...okState}
            onChange={handleChange}
        />
    );
};
