import { AmountInput as CoreComponentsAmountInput } from '@alfalab/core-components/amount-input';
import userEvent from '@testing-library/user-event';
import React, { createRef } from 'react';
import { FormikProps } from 'formik';
import { renderWithFormik, render, screen } from 'test-utils';
import { AmountInput } from '.';

type Values = {
    field: string;
};

it('should render original component', () => {
    render(
        <div data-testid="originalComponent">
            <CoreComponentsAmountInput name="field" />
        </div>,
    );
    renderWithFormik<Values>(
        <div data-testid="bindingComponent">
            <AmountInput name="field" />
        </div>,
        { initialValues: { field: '' } },
    );

    const originalComponent = screen.getByTestId('originalComponent');
    const bindingComponent = screen.getByTestId('bindingComponent');

    expect(originalComponent.innerHTML).toBe(bindingComponent.innerHTML);
});

it('should render value from formik context', () => {
    renderWithFormik<Values>(<AmountInput name="field" data-testid="input" />, {
        initialValues: { field: '100' },
    });

    expect(screen.getByTestId('input')).toHaveValue('1');
});

it('should update value inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<AmountInput name="field" data-testid="input" />, {
        initialValues: { field: '' },
        innerRef: formikRef,
    });
    await userEvent.type(screen.getByTestId('input'), '1');

    expect(formikRef.current?.values.field).toBe(100);
});

it('should update `touched` state inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<AmountInput name="field" data-testid="input" />, {
        initialValues: { field: '' },
        innerRef: formikRef,
    });

    await userEvent.click(screen.getByTestId('input'));
    await userEvent.click(document.body);

    expect(formikRef.current?.touched.field).toBe(true);
});

it('should not render error from formik context if not touched', () => {
    renderWithFormik<Values>(<AmountInput name="field" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should not render error from formik context if `error={false}` provided', () => {
    renderWithFormik<Values>(<AmountInput name="field" error={false} />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should render provided error instead of the one from formik context', () => {
    renderWithFormik<Values>(<AmountInput name="field" error="Custom error" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
    expect(screen.queryByText('Custom error')).toBeInTheDocument();
});

it('should render error from formik context if touched', () => {
    renderWithFormik<Values>(<AmountInput name="field" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).toBeInTheDocument();
});

it('should ignore entered value which is greater than `max` prop', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<AmountInput name="field" max={1000} data-testid="input" />, {
        initialValues: { field: '' },
        innerRef: formikRef,
    });
    await userEvent.type(screen.getByTestId('input'), '99', { delay: 100 });

    expect(formikRef.current?.values.field).toBe(900);
});
