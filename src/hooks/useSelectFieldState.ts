import { BaseSelectProps, OptionShape } from '@alfalab/core-components/select/typings';
import { useField } from 'formik';
import { useFieldOkState } from './useFieldOkState';
import { SetRequired } from '../types/SetRequired';

export function useSelectFieldState<P extends SetRequired<BaseSelectProps, 'name'>>(props: P): P {
    const { name, onChange, onBlur, options } = props;
    const [field, , form] = useField(name);
    const { error } = useFieldOkState(props);
    const selectedOption = options
        .reduce<OptionShape[]>(
            (acc, option) => acc.concat('key' in option ? [option] : option.options),
            [],
        )
        .find((option) => option.value === field.value);

    const handleChange: P['onChange'] = (payload) => {
        form.setValue(payload.selected?.value);

        if (onChange) {
            onChange(payload);
        }
    };

    const handleBlur: P['onBlur'] = (event) => {
        form.setTouched(true);

        if (onBlur) {
            onBlur(event);
        }
    };

    return {
        ...props,
        ...field,
        error,
        selected: selectedOption || null,
        onChange: handleChange,
        onBlur: handleBlur,
    };
}
