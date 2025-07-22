import {
  ChangeEventHandler,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import { useController } from "react-hook-form";
import { Lens } from "@hookform/lenses";

type RemovedProps = "name" | "value" | "required" | "onChange" | "onBlur";

type InputProps = {
  element?: "input";
  onChangeOverride?(
    event: Parameters<ChangeEventHandler<HTMLInputElement>>[0],
    onChange: ChangeEventHandler<HTMLInputElement>
  ): void;
};

type InputTextProps = InputProps &
  ({ type?: "text" | "email" | "tel" } & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | RemovedProps
  >);

type InputRadioProps = InputProps &
  ({ type: "radio"; value: string } & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | RemovedProps
  >);

type InputCheckboxProps = InputProps &
  ({
    type: "checkbox";
  } & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | RemovedProps
  >);

type TextareaProps = {
  element: "textarea";
  onChangeOverride?(
    event: Parameters<ChangeEventHandler<HTMLTextAreaElement>>[0],
    onChange: ChangeEventHandler<HTMLTextAreaElement>
  ): void;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, RemovedProps>;

type SelectProps = {
  element: "select";
  onChangeOverride?(
    event: Parameters<ChangeEventHandler<HTMLSelectElement>>[0],
    onChange: ChangeEventHandler<HTMLSelectElement>
  ): void;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, RemovedProps>;

// eslint-disable-next-line sonarjs/cognitive-complexity
export function Field<T>({
  formLens,
  ...props
}: {
  formLens: Lens<T>;
} & (
  | InputTextProps
  | InputRadioProps
  | InputCheckboxProps
  | TextareaProps
  | SelectProps
)) {
  const { field } = useController({
    ...(formLens as Lens<unknown> as Lens<string>).interop(),
    disabled: props.disabled
  });
  switch (props.element) {
    case "textarea": {
      const { element, onChangeOverride, ...attributes } = props;
      return (
        <textarea
          {...field}
          {...attributes}
          onChange={
            onChangeOverride
              ? event => onChangeOverride(event, field.onChange)
              : (field.onChange ?? field.onChange)
          }
        />
      );
    }
    case "select": {
      const { element, onChangeOverride, ...attributes } = props;
      return (
        <select
          {...field}
          {...attributes}
          onChange={
            onChangeOverride
              ? event => onChangeOverride(event, field.onChange)
              : (field.onChange ?? field.onChange)
          }
        />
      );
    }
    case undefined:
    case "input": {
      const { element, onChangeOverride, ...attributes } = props;
      if (props.type === "radio") {
        return (
          <input
            {...field}
            {...attributes}
            checked={field.value === props.value}
            onChange={
              onChangeOverride
                ? event => onChangeOverride(event, field.onChange)
                : field.onChange
            }
          />
        );
      }
      if (props.type === "checkbox") {
        return (
          <input
            {...field}
            {...attributes}
            checked={Boolean(field.value)}
            onChange={
              onChangeOverride
                ? event => onChangeOverride(event, field.onChange)
                : field.onChange
            }
          />
        );
      }
      return (
        <input
          {...field}
          {...attributes}
          onChange={
            onChangeOverride
              ? event => onChangeOverride(event, field.onChange)
              : field.onChange
          }
        />
      );
    }
  }
}

export function FormErrorMessage<T>({ formLens }: { formLens: Lens<T> }) {
  const controller = useController(
    (formLens as unknown as Lens<void>).interop()
  );
  return controller.fieldState.error ? (
    <span className="text-red">{controller.fieldState.error.message}</span>
  ) : null;
}
