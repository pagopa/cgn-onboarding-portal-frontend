import {
  ChangeEventHandler,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import { ControllerRenderProps, useController } from "react-hook-form";
import { HookFormControlShim, Lens } from "@hookform/lenses";

type RemovedProps = "name" | "value" | "required" | "onChange" | "onBlur";

type OnChangeOverride<T> = (
  event: Parameters<ChangeEventHandler<T>>[0],
  onChange: ChangeEventHandler<T>
) => void;

type InputProps = {
  element?: "input";
  onChangeOverride?: OnChangeOverride<HTMLInputElement>;
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
  onChangeOverride?: OnChangeOverride<HTMLTextAreaElement>;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, RemovedProps>;

type SelectProps = {
  element: "select";
  onChangeOverride?: OnChangeOverride<HTMLSelectElement>;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, RemovedProps>;

function decorateOnChange<E>(
  onChangeOverride: OnChangeOverride<E> | undefined,
  field: ControllerRenderProps<HookFormControlShim<string>>
): ChangeEventHandler<E> {
  return onChangeOverride
    ? (event: Parameters<ChangeEventHandler<E>>[0]) =>
        onChangeOverride(event, field.onChange)
    : field.onChange;
}

type NativeInputProps =
  | InputTextProps
  | InputRadioProps
  | InputCheckboxProps
  | TextareaProps
  | SelectProps;

export function Field<T>({
  formLens,
  ...props
}: { formLens: Lens<T> } & NativeInputProps) {
  const { field } = useController({
    ...(formLens as unknown as Lens<string>).interop(),
    disabled: props.disabled
  });
  switch (props.element) {
    case "textarea": {
      const { element, onChangeOverride, ...attributes } = props;
      return (
        <textarea
          {...field}
          {...attributes}
          onChange={decorateOnChange(onChangeOverride, field)}
        />
      );
    }
    case "select": {
      const { element, onChangeOverride, ...attributes } = props;
      return (
        <select
          {...field}
          {...attributes}
          onChange={decorateOnChange(onChangeOverride, field)}
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
            onChange={decorateOnChange(onChangeOverride, field)}
          />
        );
      }
      if (props.type === "checkbox") {
        return (
          <input
            {...field}
            {...attributes}
            checked={Boolean(field.value)}
            onChange={decorateOnChange(onChangeOverride, field)}
          />
        );
      }
      return (
        <input
          {...field}
          {...attributes}
          onChange={decorateOnChange(onChangeOverride, field)}
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
