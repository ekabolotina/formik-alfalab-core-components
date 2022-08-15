import React, { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { RadioGroup as CoreComponentsRadioGroup } from '@alfalab/core-components/radio-group';
import { Radio } from '@alfalab/core-components/radio';
import { Tag } from '@alfalab/core-components/tag';
import { FormikProps } from 'formik';
import { renderWithFormik, render, screen } from 'test-utils';
import { RadioGroup } from '.';

type Values = {
    field: string;
};

it('should render original component', () => {
    render(
        <div data-testid="originalComponent">
            <CoreComponentsRadioGroup name="field">
                <Radio label="One" value="one" />
                <Radio label="Two" value="two" />
            </CoreComponentsRadioGroup>
        </div>,
    );
    renderWithFormik<Values>(
        <div data-testid="bindingComponent">
            <RadioGroup name="field">
                <Radio label="One" value="one" />
                <Radio label="Two" value="two" />
            </RadioGroup>
        </div>,
        { initialValues: { field: '' } },
    );

    const originalComponent = screen.getByTestId('originalComponent');
    const bindingComponent = screen.getByTestId('bindingComponent');

    expect(originalComponent.innerHTML).toBe(bindingComponent.innerHTML);
});

it('should render value from formik context', () => {
    renderWithFormik<Values>(
        <RadioGroup name="field">
            <Radio label="One" value="one" data-testid="input-one" />
            <Radio label="Two" value="two" data-testid="input-two" />
        </RadioGroup>,
        { initialValues: { field: 'two' } },
    );

    expect(screen.getByTestId('input-one')).not.toBeChecked();
    expect(screen.getByTestId('input-two')).toBeChecked();
});

it('should update value inside formik context', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(
        <RadioGroup name="field">
            <Radio label="One" value="one" data-testid="input-one" />
            <Radio label="Two" value="two" data-testid="input-two" />
        </RadioGroup>,
        { initialValues: { field: '' }, innerRef: formikRef },
    );
    await userEvent.click(screen.getByTestId('input-two'));

    expect(formikRef.current?.values.field).toBe('two');
});

it('should update `touched` state inside formik context with `Radio`', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(
        <RadioGroup name="field">
            <Radio label="One" value="one" data-testid="input-one" />
            <Radio label="Two" value="two" data-testid="input-two" />
        </RadioGroup>,
        { initialValues: { field: '' }, innerRef: formikRef },
    );

    await userEvent.click(screen.getByTestId('input-two'));
    await userEvent.click(document.body);

    expect(formikRef.current?.touched.field).toBe(true);
});

it('should update `touched` state inside formik context with `Tag`', async () => {
    const formikRef = createRef<FormikProps<Values>>();

    renderWithFormik<Values>(
        <RadioGroup name="field">
            <Tag value="one" data-testid="input-one">
                One
            </Tag>
            <Tag value="two" data-testid="input-two">
                Two
            </Tag>
        </RadioGroup>,
        { initialValues: { field: '' }, innerRef: formikRef },
    );

    await userEvent.click(screen.getByTestId('input-two'));
    await userEvent.click(document.body);

    expect(formikRef.current?.touched.field).toBe(true);
});

it('should not render error from formik context if not touched', () => {
    renderWithFormik<Values>(
        <RadioGroup name="field">
            <Radio label="One" value="one" data-testid="input-one" />
            <Radio label="Two" value="two" data-testid="input-two" />
        </RadioGroup>,
        { initialValues: { field: '' }, initialErrors: { field: 'Error text' } },
    );

    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
});

it('should render error from formik context if touched', () => {
    renderWithFormik<Values>(
        <RadioGroup name="field">
            <Radio label="One" value="one" data-testid="input-one" />
            <Radio label="Two" value="two" data-testid="input-two" />
        </RadioGroup>,
        {
            initialValues: { field: '' },
            initialErrors: { field: 'Error text' },
            initialTouched: { field: true },
        },
    );

    expect(screen.queryByText('Error text')).toBeInTheDocument();
});
