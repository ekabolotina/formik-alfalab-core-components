import React, { FC } from 'react';
import { SetRequired } from 'type-fest';
import { useField } from 'formik';
import {
    OptionShape,
    Select as CoreComponentsSelect,
    SelectProps as CoreComponentsSelectProps,
} from '@alfalab/core-components/select';
import { useFieldOkState } from '../../hooks/useFieldOkState';

export type SelectProps = SetRequired<CoreComponentsSelectProps, 'name'>;

export const Select: FC<SelectProps> = (props) => {
    const { name, onChange, onBlur, ...restProps } = props;
    const { options } = restProps;
    const [field, , form] = useField(name);
    const { error } = useFieldOkState(props);
    const selectedOption = options
        .reduce<OptionShape[]>(
            (acc, option) => acc.concat('key' in option ? [option] : option.options),
            [],
        )
        .find((option) => option.value === field.value);

    const handleChange: SelectProps['onChange'] = (payload) => {
        form.setValue(payload.selected?.value);

        if (onChange) {
            onChange(payload);
        }
    };

    const handleBlur: SelectProps['onBlur'] = (event) => {
        form.setTouched(true);

        if (onBlur) {
            onBlur(event);
        }
    };

    return (
        <CoreComponentsSelect
            {...restProps}
            {...field}
            error={error}
            selected={selectedOption || null}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
};
