import React, { FC } from 'react';
import { SetRequired } from 'type-fest';
import {
    PhoneInput as CoreComponentsPhoneInput,
    PhoneInputProps as CoreComponentsPhoneInputProps,
} from '@alfalab/core-components/phone-input';
import { useInputFieldState } from '../hooks/useInputFieldState';

export type PhoneInputProps = SetRequired<CoreComponentsPhoneInputProps, 'name'>;

export const PhoneInput: FC<PhoneInputProps> = (props) => {
    const fieldState = useInputFieldState(props);

    return <CoreComponentsPhoneInput {...fieldState} />;
};
