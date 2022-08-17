import React, { FC } from 'react';
import {
    InputAutocomplete as CoreComponentsInputAutocomplete,
    InputAutocompleteProps as CoreComponentsInputAutocompleteProps,
} from '@alfalab/core-components/input-autocomplete';
import { SetRequired } from 'type-fest';
import { useSelectFieldState } from '../hooks/useSelectFieldState';

export type InputAutocompleteProps = SetRequired<CoreComponentsInputAutocompleteProps, 'name'>;

export const InputAutocomplete: FC<InputAutocompleteProps> = (props) => {
    const { selected, ...fieldState } = useSelectFieldState(props);

    return <CoreComponentsInputAutocomplete {...fieldState} />;
};
