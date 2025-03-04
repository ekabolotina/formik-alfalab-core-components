import React, { FC } from 'react';
import { useField } from 'formik';
import {
    Switch as CoreComponentsSwitch,
    SwitchProps as CoreComponentsSwitchProps,
} from '@alfalab/core-components/switch';
import { useFieldBlurState } from '../hooks/useFieldBlurState';
import { useFieldOkState } from '../hooks/useFieldOkState';
import { SetRequired } from '../types/SetRequired';

export type SwitchProps = SetRequired<CoreComponentsSwitchProps, 'name'>;

export const Switch: FC<SwitchProps> = (props) => {
    const { name, onChange, ...restProps } = props;
    const [{ value, ...field }] = useField({ name, type: 'checkbox' });
    const { error } = useFieldOkState(props);
    const blurState = useFieldBlurState(props);

    const handleChange: SwitchProps['onChange'] = (event, payload) => {
        field.onChange(event);

        if (onChange) {
            onChange(event, payload);
        }
    };

    return (
        <CoreComponentsSwitch
            {...restProps}
            {...field}
            {...blurState}
            error={error}
            onChange={handleChange}
        />
    );
};
