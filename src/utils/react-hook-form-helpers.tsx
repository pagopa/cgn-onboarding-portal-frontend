import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import { useController } from "react-hook-form";
import { Lens } from "@hookform/lenses";

type RemovedProps =
  | "name"
  | "value"
  | "disabled"
  | "required"
  | "onChange"
  | "onBlur";

export function Field<T>({
  formLens,
  ...props
}: {
  formLens: Lens<T>;
} & (
  | ({ element?: "input"; type?: "text" | "email" | "tel" } & Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "type" | RemovedProps
    >)
  | ({ element?: "input"; type: "radio"; value: string } & Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "type" | "value" | RemovedProps
    >)
  | ({ element?: "input"; type: "checkbox" } & Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "type" | "value" | RemovedProps
    >)
  | ({ element: "textarea" } & Omit<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      RemovedProps
    >)
  | ({ element: "select" } & Omit<
      SelectHTMLAttributes<HTMLSelectElement>,
      RemovedProps
    >)
)) {
  const { field } = useController(
    (formLens as Lens<unknown> as Lens<string>).interop()
  );
  {
    switch (props.element) {
      case "textarea": {
        const { element, ...attributes } = props;
        return <textarea {...field} {...attributes} />;
      }
      case "select": {
        const { element, ...attributes } = props;
        return <select {...field} {...attributes} />;
      }
      case undefined:
      case "input": {
        const { element, ...attributes } = props;
        if (props.type === "radio") {
          return (
            <input
              {...field}
              {...attributes}
              checked={field.value === props.value}
            />
          );
        }
        return <input {...field} {...attributes} />;
      }
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
