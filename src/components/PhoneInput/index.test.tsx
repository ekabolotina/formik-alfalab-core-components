import React, { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { PhoneInput as CoreComponentsPhoneInput } from '@alfalab/core-components/phone-input';
import { FormikProps } from 'formik';
import { renderWithFormik, render, screen } from 'test-utils';
import { PhoneInput } from '.';

type Values = {
    field: string;
};

it('should render original component', () => {
    render(
        <div data-testid="originalComponent">
            <CoreComponentsPhoneInput name="field" />
        </div>,
    );
    renderWithFormik<Values>(
        <div data-testid="bindingComponent">
            <PhoneInput name="field" />
        </div>,
        { initialValues: { field: '' } },
    );

    const originalComponent = screen.getByTestId('originalComponent');
    const bindingComponent = screen.getByTestId('bindingComponent');

    expect(originalComponent.innerHTML).toBe(bindingComponent.innerHTML);
});

it('should render value from formik context', () => {
    renderWithFormik<Values>(<PhoneInput name="field" data-testid="input" />, {
        initialValues: { field: '79876543210' },
    });

    expect(screen.getByTestId('input')).toHaveValue('+7 987 654-32-10');
});

it('should update value inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<PhoneInput name="field" data-testid="input" />, {
        initialValues: { field: '' },
        innerRef: formikRef,
    });
    await userEvent.type(screen.getByTestId('input'), '79876543210', { delay: 20 });

    expect(formikRef.current?.values.field).toBe('+7 987 654-32-10');
});

it('should update `touched` state inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<PhoneInput name="field" data-testid="input" />, {
        initialValues: { field: '' },
        innerRef: formikRef,
    });

    await userEvent.click(screen.getByTestId('input'));
    await userEvent.click(document.body);

    expect(formikRef.current?.touched.field).toBe(true);
});

it('should not render error from formik context if not touched', () => {
    renderWithFormik<Values>(<PhoneInput name="field" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should render error from formik context if touched', () => {
    renderWithFormik<Values>(<PhoneInput name="field" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).toBeInTheDocument();
});
