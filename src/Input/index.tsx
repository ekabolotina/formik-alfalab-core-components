import React, { FC } from 'react';
import {
    Input as CoreComponentsInput,
    InputProps as CoreComponentsInputProps,
} from '@alfalab/core-components/input';
import { useInputFieldState } from '../hooks/useInputFieldState';
import { SetRequired } from '../types/SetRequired';

export type InputProps = SetRequired<CoreComponentsInputProps, 'name'>;

export const Input: FC<InputProps> = (props) => {
    const fieldState = useInputFieldState(props);

    return <CoreComponentsInput {...fieldState} />;
};
