import React, { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { Select as CoreComponentsSelect } from '@alfalab/core-components/select';
import { FormikProps } from 'formik';
import { renderWithFormik, render, screen } from 'test-utils';
import { Select } from '.';

type Values = {
    field: string;
};

const OPTIONS = [
    { key: 'one', value: 'one', content: 'One' },
    { key: 'two', value: 'two', content: 'Two' },
];

it('should render original component', () => {
    render(
        <div data-testid="originalComponent">
            <CoreComponentsSelect name="field" options={OPTIONS} id="id" />
        </div>,
    );
    renderWithFormik<Values>(
        <div data-testid="bindingComponent">
            <Select name="field" options={OPTIONS} id="id" />
        </div>,
        { initialValues: { field: '' } },
    );

    const originalComponent = screen.getByTestId('originalComponent');
    const bindingComponent = screen.getByTestId('bindingComponent');

    expect(originalComponent.innerHTML).toBe(bindingComponent.innerHTML);
});

it('should render value from formik context', () => {
    renderWithFormik<Values>(<Select name="field" options={OPTIONS} />, {
        initialValues: { field: 'two' },
    });

    expect(screen.getByDisplayValue('two')).toBeInTheDocument();
});

it('should update value inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    const { container } = renderWithFormik<Values>(
        <Select name="field" options={OPTIONS} dataTestId="select" />,
        { initialValues: { field: '' }, innerRef: formikRef },
    );
    const field = container.querySelector('[data-test-id="select-field"]') as Element;

    await userEvent.click(field);
    await userEvent.click(screen.getByText('Two'));

    expect(formikRef.current?.values.field).toBe('two');
});

it('should update `touched` state inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    const { container } = renderWithFormik<Values>(
        <Select name="field" options={OPTIONS} dataTestId="select" />,
        { initialValues: { field: '' }, innerRef: formikRef },
    );
    const field = container.querySelector('[data-test-id="select-field"]') as Element;

    await userEvent.click(field);
    await userEvent.click(document.body);

    expect(formikRef.current?.touched.field).toBe(true);
});

it('should not render error from formik context if not touched', () => {
    renderWithFormik<Values>(<Select name="field" options={OPTIONS} />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should render error from formik context if touched', () => {
    renderWithFormik<Values>(<Select name="field" options={OPTIONS} />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).toBeInTheDocument();
});
