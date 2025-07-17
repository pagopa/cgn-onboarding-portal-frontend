import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import {
  Control,
  Controller,
  FieldValues,
  useController,
  useForm,
  UseFormProps,
  UseFormReturn
} from "react-hook-form";
import z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lens, useLens } from "@hookform/lenses";

type RemovedProps =
  | "name"
  | "value"
  | "disabled"
  | "required"
  | "onChange"
  | "onBlur";

export function Field<T extends string = string>({
  element,
  formLens,
  ...props
}: {
  formLens: Lens<T>;
} & (
  | ({ element?: "input" } & Omit<
      InputHTMLAttributes<HTMLInputElement>,
      RemovedProps
    >)
  | ({ element?: "input"; type: "radio" } & Omit<
      InputHTMLAttributes<HTMLInputElement>,
      Exclude<RemovedProps, "type" | "value">
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
  const { control, name } = formLens.interop();
  return (
    <Controller
      control={control as any}
      name={name}
      render={({ field }) => {
        switch (element) {
          case "textarea":
            return <textarea {...field} {...(props as any)} />;
          case "select":
            return <select {...field} {...(props as any)} />;
          default:
            return <input {...field} {...(props as any)} />;
        }
      }}
    />
  );
}

export function FormErrorMessage<T>({ formLens }: { formLens: Lens<T> }) {
  const controller = useController(
    (formLens as unknown as Lens<void>).interop()
  );
  return controller.fieldState.error ? (
    <span className="text-red">{controller.fieldState.error.message}</span>
  ) : null;
}

export function useStandardForm<
  TFieldValues extends FieldValues = FieldValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues
>(
  props: UseFormProps<TFieldValues, TContext, TTransformedValues> & {
    zodSchemaFactory(
      values: TFieldValues
    ): z.ZodSchema<TTransformedValues, TFieldValues>;
  }
): UseFormReturn<TFieldValues, TContext, TTransformedValues> & {
  lens: Lens<TFieldValues>;
} {
  const form = useForm({
    ...props,
    resolver:
      props.resolver ??
      ((values, context, options) =>
        zodResolver(props.zodSchemaFactory(values))(values, context, options))
  });
  const lens = useLens({
    control: form.control as unknown as Control<TFieldValues>
  });
  return { ...form, lens };
}
