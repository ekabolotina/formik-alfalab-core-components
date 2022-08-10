import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { FormikConfig, Formik } from 'formik';
import { SetOptional } from 'type-fest';

export function renderWithFormik<V>(
    ui: ReactElement,
    formikConfig: SetOptional<FormikConfig<V>, 'onSubmit'>,
    options?: Omit<RenderOptions, 'wrapper'>,
) {
    return render(ui, {
        wrapper: ({ children }) => (
            <Formik onSubmit={() => {}} {...formikConfig}>
                {children}
            </Formik>
        ),
        ...options,
    });
}

export * from '@testing-library/react';
