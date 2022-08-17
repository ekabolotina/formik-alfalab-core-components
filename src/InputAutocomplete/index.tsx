import React, { FC, useState } from 'react';
import {
    InputAutocomplete as CoreComponentsInputAutocomplete,
    InputAutocompleteProps as CoreComponentsInputAutocompleteProps,
} from '@alfalab/core-components/input-autocomplete';
import { SetRequired } from 'type-fest';
import { useSelectFieldState } from '../hooks/useSelectFieldState';

export type InputAutocompleteProps = SetRequired<CoreComponentsInputAutocompleteProps, 'name'>;

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

    const handleInput: CoreComponentsInputAutocompleteProps['onInput'] = (event) => {
        setInputValue(event.target.value);

        if (onInput) {
            onInput(event);
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
