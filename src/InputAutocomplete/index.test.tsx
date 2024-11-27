import React, { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { InputAutocomplete as CoreComponentsInputAutocomplete } from '@alfalab/core-components/input-autocomplete';
import { FormikProps } from 'formik';
import { renderWithFormik, render, screen, createMatchMediaMock } from 'test-utils';
import { InputAutocomplete } from '.';

type Values = {
    field: string;
};

const OPTIONS = [
    { key: 'one', value: 'one', content: 'One' },
    { key: 'two', value: 'two', content: 'Two' },
];

const matchMediaMock = createMatchMediaMock();

const handleChange = jest.fn();

beforeAll(() => {
    matchMediaMock.desktop();
});

afterAll(() => {
    matchMediaMock.destroy();
});

it('should render original component', () => {
    render(
        <div data-testid="originalComponent">
            <CoreComponentsInputAutocomplete
                name="field"
                options={OPTIONS}
                id="id"
                onChange={handleChange}
            />
        </div>,
    );
    renderWithFormik<Values>(
        <div data-testid="bindingComponent">
            <InputAutocomplete name="field" options={OPTIONS} id="id" />
        </div>,
        { initialValues: { field: '' } },
    );

    const originalComponent = screen.getByTestId('originalComponent');
    const bindingComponent = screen.getByTestId('bindingComponent');

    expect(originalComponent.innerHTML).toBe(bindingComponent.innerHTML);
});

it('should render value from formik context', () => {
    renderWithFormik<Values>(<InputAutocomplete name="field" options={OPTIONS} />, {
        initialValues: { field: 'two' },
    });

    expect(screen.getByDisplayValue('two')).toBeInTheDocument();
});

it('should update value inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<InputAutocomplete name="field" options={OPTIONS} />, {
        initialValues: { field: '' },
        innerRef: formikRef,
    });
    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.click(screen.getByText('Two'));

    expect(formikRef.current?.values.field).toBe('two');
});

it('should allow to type custom text', async () => {
    renderWithFormik<Values>(<InputAutocomplete name="field" options={OPTIONS} />, {
        initialValues: { field: 'Initial text' },
    });

    await userEvent.clear(screen.getByRole('textbox'));
    await userEvent.type(screen.getByRole('textbox'), 'New text');

    expect(screen.getByRole('textbox')).toHaveValue('New text');
});

it('should reset typed text if option was not selected', async () => {
    renderWithFormik<Values>(<InputAutocomplete name="field" options={OPTIONS} />, {
        initialValues: { field: 'Initial text' },
    });

    await userEvent.clear(screen.getByRole('textbox'));
    await userEvent.type(screen.getByRole('textbox'), 'New text');
    await userEvent.click(document.body);

    expect(screen.getByRole('textbox')).toHaveValue('Initial text');
});

it('should render text from selected option', async () => {
    renderWithFormik<Values>(<InputAutocomplete name="field" options={OPTIONS} />, {
        initialValues: { field: '' },
    });

    await userEvent.type(screen.getByRole('textbox'), 'New text');
    await userEvent.click(screen.getByText('Two'));

    expect(screen.getByRole('textbox')).toHaveValue('two');
});

it('should update `touched` state inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<InputAutocomplete name="field" options={OPTIONS} />, {
        initialValues: { field: '' },
        innerRef: formikRef,
    });
    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.click(document.body);

    expect(formikRef.current?.touched.field).toBe(true);
});

it('should not render error from formik context if not touched', () => {
    renderWithFormik<Values>(<InputAutocomplete name="field" options={OPTIONS} />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should not render error from formik context if `error={false}` provided', () => {
    renderWithFormik<Values>(<InputAutocomplete name="field" options={OPTIONS} error={false} />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should render provided error instead of the one from formik context', () => {
    renderWithFormik<Values>(
        <InputAutocomplete name="field" options={OPTIONS} error="Custom error" />,
        {
            initialValues: { field: '' },
            initialErrors: { field: 'Error text' },
            initialTouched: { field: true },
        },
    );

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
    expect(screen.queryByText('Custom error')).toBeInTheDocument();
});

it('should render error from formik context if touched', () => {
    renderWithFormik<Values>(<InputAutocomplete name="field" options={OPTIONS} />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).toBeInTheDocument();
});
