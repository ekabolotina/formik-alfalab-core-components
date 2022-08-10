import React, { FC } from 'react';
import { SetRequired } from 'type-fest';
import { useField } from 'formik';
import {
    Switch as CoreComponentsSwitch,
    SwitchProps as CoreComponentsSwitchProps,
} from '@alfalab/core-components/switch';
import { useFieldBlurState } from '../hooks/useFieldBlurState';

export type SwitchProps = SetRequired<CoreComponentsSwitchProps, 'name'>;

export const Switch: FC<SwitchProps> = (props) => {
    const { name, onChange, ...restProps } = props;
    const [{ value, ...field }] = useField({ name, type: 'checkbox' });
    const blurState = useFieldBlurState(props);

    const handleChange: SwitchProps['onChange'] = (event, payload) => {
        field.onChange(event);

        if (onChange) {
            onChange(event, payload);
        }
    };

    return (
        <CoreComponentsSwitch {...restProps} {...field} {...blurState} onChange={handleChange} />
    );
};
