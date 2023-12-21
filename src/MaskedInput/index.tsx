import React, { FC } from 'react';
import {
    MaskedInput as CoreComponentsMaskedInput,
    MaskedInputProps as CoreComponentsMaskedInpuProps,
} from '@alfalab/core-components/masked-input';
import { useInputFieldState } from '../hooks/useInputFieldState';
import { SetRequired } from '../types/SetRequired';

export type MaskedInputProps = SetRequired<CoreComponentsMaskedInpuProps, 'name'>;

export const MaskedInput: FC<MaskedInputProps> = (props) => {
    const fieldState = useInputFieldState(props);

    return <CoreComponentsMaskedInput {...fieldState} />;
};
