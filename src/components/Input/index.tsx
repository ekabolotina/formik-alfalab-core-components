import React, { FC } from 'react';
import { SetRequired } from 'type-fest';
import {
    Input as CoreComponentsInput,
    InputProps as CoreComponentsInputProps,
} from '@alfalab/core-components/input';
import { useInputFieldState } from '../../hooks/useInputFieldState';

export type InputProps = SetRequired<CoreComponentsInputProps, 'name'>;

export const Input: FC<InputProps> = (props) => {
    const fieldState = useInputFieldState(props);

    return <CoreComponentsInput {...fieldState} />;
};
