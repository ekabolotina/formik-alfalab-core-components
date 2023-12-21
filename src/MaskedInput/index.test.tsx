import React, { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { MaskedInput as CoreComponentsMaskedInput } from '@alfalab/core-components/masked-input';
import { FormikProps } from 'formik';
import { renderWithFormik, render, screen, createMatchMediaMock } from 'test-utils';
import { MaskedInput, MaskedInputProps } from '.';

type Values = {
    field: string;
};

const MASK: MaskedInputProps['mask'] = [/\d/, /\d/, '-', /\d/, /\d/];

const matchMediaMock = createMatchMediaMock();

beforeAll(() => {
    matchMediaMock.desktop();
});

afterAll(() => {
    matchMediaMock.destroy();
});

it('should render original component', () => {
    render(
        <div data-testid="originalComponent">
            <CoreComponentsMaskedInput name="field" mask={MASK} />
        </div>,
    );
    renderWithFormik<Values>(
        <div data-testid="bindingComponent">
            <MaskedInput name="field" mask={MASK} />
        </div>,
        { initialValues: { field: '' } },
    );

    const originalComponent = screen.getByTestId('originalComponent');
    const bindingComponent = screen.getByTestId('bindingComponent');

    expect(originalComponent.innerHTML).toBe(bindingComponent.innerHTML);
});

it('should render value from formik context', () => {
    renderWithFormik<Values>(<MaskedInput name="field" data-testid="input" mask={MASK} />, {
        initialValues: { field: '11-22' },
    });

    expect(screen.getByTestId('input')).toHaveValue('11-22');
});

it('should update value inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<MaskedInput name="field" data-testid="input" mask={MASK} />, {
        initialValues: { field: '' },
        innerRef: formikRef,
    });
    await userEvent.type(screen.getByTestId('input'), '11-22');

    expect(formikRef.current?.values.field).toBe('11-22');
});

it('should update `touched` state inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<MaskedInput name="field" data-testid="input" mask={MASK} />, {
        initialValues: { field: '' },
        innerRef: formikRef,
    });

    await userEvent.click(screen.getByTestId('input'));
    await userEvent.click(document.body);

    expect(formikRef.current?.touched.field).toBe(true);
});

it('should not render error from formik context if not touched', () => {
    renderWithFormik<Values>(<MaskedInput name="field" mask={MASK} />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should not render error from formik context if `error={false}` provided', () => {
    renderWithFormik<Values>(<MaskedInput name="field" mask={MASK} error={false} />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should render provided error instead of the one from formik context', () => {
    renderWithFormik<Values>(<MaskedInput name="field" mask={MASK} error="Custom error" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
    expect(screen.queryByText('Custom error')).toBeInTheDocument();
});

it('should render error from formik context if touched', () => {
    renderWithFormik<Values>(<MaskedInput name="field" mask={MASK} />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).toBeInTheDocument();
});
