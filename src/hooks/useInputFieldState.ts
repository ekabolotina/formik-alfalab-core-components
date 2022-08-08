import { useField } from 'formik';
import { SetRequired } from 'type-fest';
import { InputProps } from '@alfalab/core-components/input';
import { useFieldBlurState } from './useFieldBlurState';
import { useFieldOkState } from './useFieldOkState';

export function useInputFieldState<T extends SetRequired<InputProps, 'name'>>(inputProps: T) {
    const { name, onChange } = inputProps;
    const [field, , form] = useField(name);
    const okState = useFieldOkState(inputProps);
    const blurState = useFieldBlurState(inputProps);

    const handleChange: T['onChange'] = (event, payload) => {
        form.setValue(payload.value);

        if (onChange) {
            onChange(event, payload);
        }
    };

    return {
        ...inputProps,
        ...field,
        ...blurState,
        ...okState,
        onChange: handleChange,
    };
}
