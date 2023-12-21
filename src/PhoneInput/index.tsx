import React, { FC } from 'react';
import {
    PhoneInput as CoreComponentsPhoneInput,
    PhoneInputProps as CoreComponentsPhoneInputProps,
} from '@alfalab/core-components/phone-input';
import { useInputFieldState } from '../hooks/useInputFieldState';
import { SetRequired } from '../types/SetRequired';

export type PhoneInputProps = SetRequired<CoreComponentsPhoneInputProps, 'name'>;

export const PhoneInput: FC<PhoneInputProps> = (props) => {
    const fieldState = useInputFieldState(props);

    return <CoreComponentsPhoneInput {...fieldState} />;
};
