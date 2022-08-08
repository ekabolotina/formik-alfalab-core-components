import React, { FC } from 'react';
import {
    MaskedInput as CoreComponentsMaskedInput,
    MaskedInputProps as CoreComponentsMaskedInpuProps,
} from '@alfalab/core-components/masked-input';
import { SetRequired } from 'type-fest';
import { useInputFieldState } from '../../hooks/useInputFieldState';

export type MaskedInputProps = SetRequired<CoreComponentsMaskedInpuProps, 'name'>;

export const MaskedInput: FC<MaskedInputProps> = (props) => {
    const fieldState = useInputFieldState(props);

    return <CoreComponentsMaskedInput {...fieldState} />;
};
