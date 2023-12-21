import { useField } from 'formik';
import { InputProps } from '@alfalab/core-components/input';
import { useFieldBlurState } from './useFieldBlurState';
import { useFieldOkState } from './useFieldOkState';
import { SetRequired } from '../types/SetRequired';

export function useInputFieldState<P extends SetRequired<InputProps, 'name'>>(props: P): P {
    const { name, onChange } = props;
    const [field, , form] = useField(name);
    const okState = useFieldOkState(props);
    const blurState = useFieldBlurState(props);

    const handleChange: P['onChange'] = (event, payload) => {
        form.setValue(payload.value);

        if (onChange) {
            onChange(event, payload);
        }
    };

    return {
        ...props,
        ...field,
        ...blurState,
        ...okState,
        onChange: handleChange,
    };
}
