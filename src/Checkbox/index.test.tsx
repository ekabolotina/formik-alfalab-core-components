import React, { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { Checkbox as CoreComponentsCheckbox } from '@alfalab/core-components/checkbox';
import { FormikProps } from 'formik';
import { renderWithFormik, render, screen } from 'test-utils';
import { Checkbox } from '.';

type Values = {
    field: boolean | '';
};

it('should render original component', () => {
    render(
        <div data-testid="originalComponent">
            <CoreComponentsCheckbox name="field" />
        </div>,
    );
    renderWithFormik<Values>(
        <div data-testid="bindingComponent">
            <Checkbox name="field" />
        </div>,
        { initialValues: { field: '' } },
    );

    const originalComponent = screen.getByTestId('originalComponent');
    const bindingComponent = screen.getByTestId('bindingComponent');

    expect(originalComponent.innerHTML).toBe(bindingComponent.innerHTML);
});

it('should render value from formik context', () => {
    renderWithFormik<Values>(<Checkbox name="field" data-testid="input" />, {
        initialValues: { field: true },
    });

    expect(screen.getByTestId('input')).toBeChecked();
});

it('should update value inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<Checkbox name="field" data-testid="input" />, {
        initialValues: { field: false },
        innerRef: formikRef,
    });

    await userEvent.click(screen.getByTestId('input'));

    expect(formikRef.current?.values.field).toBe(true);
});

it('should update `touched` state inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<Checkbox name="field" data-testid="input" />, {
        initialValues: { field: '' },
        innerRef: formikRef,
    });

    await userEvent.click(screen.getByTestId('input'));
    await userEvent.click(document.body);

    expect(formikRef.current?.touched.field).toBe(true);
});

it('should not render error from formik context if not touched', () => {
    renderWithFormik<Values>(<Checkbox name="field" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should not render error from formik context if `error={false}` provided', () => {
    renderWithFormik<Values>(<Checkbox name="field" error={false} />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should render provided error instead of the one from formik context', () => {
    renderWithFormik<Values>(<Checkbox name="field" error="Custom error" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
    expect(screen.queryByText('Custom error')).toBeInTheDocument();
});

it('should render error from formik context if touched', () => {
    renderWithFormik<Values>(<Checkbox name="field" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).toBeInTheDocument();
});
