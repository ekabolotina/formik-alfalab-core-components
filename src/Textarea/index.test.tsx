import React, { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { Textarea as CoreComponentsTextarea } from '@alfalab/core-components/textarea';
import { FormikProps } from 'formik';
import { renderWithFormik, render, screen, createMatchMediaMock } from 'test-utils';
import { Textarea } from '.';

type Values = {
    field: string;
};

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
            <CoreComponentsTextarea name="field" />
        </div>,
    );
    renderWithFormik<Values>(
        <div data-testid="bindingComponent">
            <Textarea name="field" />
        </div>,
        { initialValues: { field: '' } },
    );

    const originalComponent = screen.getByTestId('originalComponent');
    const bindingComponent = screen.getByTestId('bindingComponent');

    expect(originalComponent.innerHTML).toBe(bindingComponent.innerHTML);
});

it('should render value from formik context', () => {
    renderWithFormik<Values>(<Textarea name="field" data-testid="input" />, {
        initialValues: { field: 'valueFromFormikContext' },
    });

    expect(screen.getByTestId('input')).toHaveValue('valueFromFormikContext');
});

it('should update value inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<Textarea name="field" data-testid="input" />, {
        initialValues: { field: '' },
        innerRef: formikRef,
    });
    await userEvent.type(screen.getByTestId('input'), 'typedValue');

    expect(formikRef.current?.values.field).toBe('typedValue');
});

it('should update `touched` state inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(<Textarea name="field" data-testid="input" />, {
        initialValues: { field: '' },
        innerRef: formikRef,
    });

    await userEvent.click(screen.getByTestId('input'));
    await userEvent.click(document.body);

    expect(formikRef.current?.touched.field).toBe(true);
});

it('should not render error from formik context if not touched', () => {
    renderWithFormik<Values>(<Textarea name="field" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should not render error from formik context if `error={false}` provided', () => {
    renderWithFormik<Values>(<Textarea name="field" error={false} />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should render provided error instead of the one from formik context', () => {
    renderWithFormik<Values>(<Textarea name="field" error="Custom error" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
    expect(screen.queryByText('Custom error')).toBeInTheDocument();
});

it('should render error from formik context if touched', () => {
    renderWithFormik<Values>(<Textarea name="field" />, {
        initialValues: { field: '' },
        initialErrors: { field: 'Error text' },
        initialTouched: { field: true },
    });

    expect(screen.queryByText('Error text')).toBeInTheDocument();
});

it('should call provided `onChange` callback', async () => {
    const onChangeCallback = jest.fn();

    renderWithFormik<Values>(
        <Textarea name="field" data-testid="input" onChange={onChangeCallback} />,
        {
            initialValues: { field: '' },
        },
    );
    await userEvent.type(screen.getByTestId('input'), 'typedValue');

    expect(onChangeCallback).toHaveBeenLastCalledWith(
        expect.objectContaining({ target: expect.objectContaining({ value: 'typedValue' }) }),
        { value: 'typedValue' },
    );
});

it('should call provided `onBlur` callback', async () => {
    const onBlurCallback = jest.fn();

    renderWithFormik<Values>(
        <Textarea name="field" data-testid="input" onBlur={onBlurCallback} />,
        {
            initialValues: { field: '' },
        },
    );
    await userEvent.click(screen.getByTestId('input'));
    await userEvent.click(document.body);

    expect(onBlurCallback).toBeCalled();
});
