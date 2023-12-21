import React, { FC } from 'react';
import {
    Select as CoreComponentsSelect,
    SelectProps as CoreComponentsSelectProps,
} from '@alfalab/core-components/select';
import { useSelectFieldState } from '../hooks/useSelectFieldState';
import { SetRequired } from '../types/SetRequired';

export type SelectProps = SetRequired<CoreComponentsSelectProps, 'name'>;

export const Select: FC<SelectProps> = (props) => {
    const fieldState = useSelectFieldState(props);

    return <CoreComponentsSelect {...fieldState} />;
};
