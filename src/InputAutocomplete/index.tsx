import React, { FC, useState } from 'react';
import {
    InputAutocomplete as CoreComponentsInputAutocomplete,
    InputAutocompleteProps as CoreComponentsInputAutocompleteProps,
} from '@alfalab/core-components/input-autocomplete';
import { useSelectFieldState } from '../hooks/useSelectFieldState';
import { SetRequired } from '../types/SetRequired';

export type InputAutocompleteProps = SetRequired<
    Omit<CoreComponentsInputAutocompleteProps, 'onChange'> &
        Partial<Pick<CoreComponentsInputAutocompleteProps, 'onChange'>>,
    'name'
>;

export const InputAutocomplete: FC<InputAutocompleteProps> = (props) => {
    const { selected, value, onChange, onFocus, onInput, onBlur, ...fieldState } =
        useSelectFieldState(props);
    const [inputValue, setInputValue] = useState<string>();

    const handleFocus: CoreComponentsInputAutocompleteProps['onFocus'] = (event) => {
        setInputValue(value);

        if (onFocus) {
            onFocus(event);
        }
    };

    const handleInput: CoreComponentsInputAutocompleteProps['onInput'] = (newValue, reason) => {
        setInputValue(newValue);

        if (onInput) {
            onInput(newValue, reason);
        }
    };

    const handleBlur: CoreComponentsInputAutocompleteProps['onBlur'] = (event) => {
        setInputValue(undefined);

        if (onBlur) {
            onBlur(event);
        }
    };

    const handleChange: CoreComponentsInputAutocompleteProps['onChange'] = (payload) => {
        setInputValue(undefined);

        if (onChange) {
            onChange(payload);
        }
    };

    return (
        <CoreComponentsInputAutocomplete
            {...fieldState}
            value={inputValue ?? value}
            onFocus={handleFocus}
            onInput={handleInput}
            onBlur={handleBlur}
            onChange={handleChange}
        />
    );
};
