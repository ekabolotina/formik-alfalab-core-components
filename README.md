# formik-alfalab-core-components

Bindings for [formik](https://formik.org/) and [@alfalab/core-components](https://github.com/core-ds/core-components).

## Usage

Just use the components from `formik-alfalab-core-components` as a drop-in replacement of the components 
from `@alfalab/core-components`, but with one required prop `name`. Available components are:
* Input
* AmountInput
* MaskedInput
* PhoneInput
* RadioGroup
* Select
* Switch

Consider the example:
```tsx
import React from 'react';
import { Formik, Form } from 'formik';
import { Input } from 'formik-alfalab-core-components';

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

## How it works?

Under the hood it connects to the Formik's state via `useField` hook and `name` prop.
Then the given state is passed to original component from `@alfalab/core-components`.
