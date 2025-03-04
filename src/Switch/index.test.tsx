import React, { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { Switch as CoreComponentsSwitch } from '@alfalab/core-components/switch';
import { FormikProps } from 'formik';
import { renderWithFormik, render, screen } from 'test-utils';
import { Switch } from '.';

type Values = {
    field: boolean | '';
};

it('should render original component', () => {
    render(
        <div data-testid="originalComponent">
            <CoreComponentsSwitch name="field" />
        </div>,
    );
    renderWithFormik<Values>(
        <div data-testid="bindingComponent">
            <Switch name="field" />
        </div>,
        { initialValues: { field: '' } },
    );

    const originalComponent = screen.getByTestId('originalComponent');
    const bindingComponent = screen.getByTestId('bindingComponent');

    expect(originalComponent.innerHTML).toBe(bindingComponent.innerHTML);
});

it('should render value from formik context', () => {
    renderWithFormik<Values>(<Switch name="field" data-testid="input" />, {
        initialValues: { field: true },
    });

    expect(screen.getByTestId('input')).toBeChecked();
});

it('should update value inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<Switch name="field" data-testid="input" />, {
        initialValues: { field: false },
        innerRef: formikRef,
    });
    await userEvent.click(screen.getByTestId('input'));

    expect(formikRef.current?.values.field).toBe(true);
});

it('should update `touched` state inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<Switch name="field" data-testid="input" />, {
        initialValues: { field: '' },
        innerRef: formikRef,
    });

    await userEvent.click(screen.getByTestId('input'));
    await userEvent.click(document.body);

    expect(formikRef.current?.touched.field).toBe(true);
});

it('should not render error from formik context if not touched', () => {
    renderWithFormik<Values>(<Switch name="field" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should not render error from formik context if `error={false}` provided', () => {
    renderWithFormik<Values>(<Switch name="field" error={false} />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should render provided error instead of the one from formik context', () => {
    renderWithFormik<Values>(<Switch name="field" error="Custom error" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
    expect(screen.queryByText('Custom error')).toBeInTheDocument();
});

it('should render error from formik context if touched', () => {
    renderWithFormik<Values>(<Switch name="field" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).toBeInTheDocument();
});
