# formik-alfalab-core-components

Bindings for [formik](https://formik.org/) and [@alfalab/core-components](https://github.com/core-ds/core-components).

## Usage

Just use the components from `formik-alfalab-core-components` as a drop-in replacement of the components 
from `@alfalab/core-components`, but with one required prop `name`. Available components are:
* AmountInput
* Input
* InputAutocomplete
* MaskedInput
* PhoneInput
* RadioGroup
* Select
* Switch
* Textarea

Consider the example:
```tsx
import React from 'react';
import { Formik, Form } from 'formik';
import { Input } from 'formik-alfalab-core-components/Input';

export const MyForm: FC = () => {
    return (
        <Formik 
            initialValues={{ name: '' }} 
            onSubmit={(values) => { console.log(values) }}
        >
            <Form>
                <Input name="name" />
                <button type="submit">Submit</button>
            </Form>
        </Formik>
    );
};
```

### Exports

Each component can be imported from the subdirectory:
```tsx
import { Input } from 'formik-alfalab-core-components/Input';
```
This library also exposes some utility hooks which are used under the hood by components:
* `useFieldBlurState` — useful for handling `blur` event inside formik context;
* `useFieldOkState` — provides `error` and `success` props using formik state; 
* `useInputFieldState` — provides `props: InputProps` using formik state;
* `useSelectFieldState` — provides `props: BaseSelectProps` using formik state.

These hooks are available under `formik-alfalab-core-components/hooks` and can be used 
to bind your custom components to formik.

## How does it work?

Under the hood it connects to the Formik's state via `useField` hook and `name` prop.
Then the given state is passed to original component from `@alfalab/core-components`.
