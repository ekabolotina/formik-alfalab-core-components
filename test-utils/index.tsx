import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { FormikConfig, Formik } from 'formik';
import MatchMediaMock from 'jest-matchmedia-mock';

export function renderWithFormik<V>(
    ui: ReactElement,
    formikConfig: Omit<FormikConfig<V>, 'onSubmit'> & Partial<Pick<FormikConfig<V>, 'onSubmit'>>,
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

export function createMatchMediaMock() {
    let matchMedia: MatchMediaMock | null = null;

    return {
        mobile: () => {
            matchMedia = matchMedia ?? new MatchMediaMock();
            matchMedia.useMediaQuery('(max-width: 1024px)');
        },
        desktop: () => {
            matchMedia = matchMedia ?? new MatchMediaMock();
            matchMedia.useMediaQuery('(min-width: 1024px)');
        },
        destroy: () => {
            matchMedia?.destroy();
        },
    };
}

export * from '@testing-library/react';
