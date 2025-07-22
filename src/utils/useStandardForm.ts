import { Lens, useLens } from "@hookform/lenses";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Control,
  FieldValues,
  useForm,
  UseFormProps,
  UseFormReturn
} from "react-hook-form";
import { z } from "zod/v4";

export function useStandardForm<
  TFieldValues extends FieldValues = FieldValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues
>(
  props: UseFormProps<TFieldValues, TContext, TTransformedValues> & {
    zodSchema: z.ZodType<TTransformedValues, TFieldValues>;
  }
): UseFormReturn<TFieldValues, TContext, TTransformedValues> & {
  lens: Lens<TFieldValues>;
} {
  const form = useForm({
    ...props,
    resolver: props.resolver ?? zodResolver(props.zodSchema)
  });
  const lens = useLens({
    control: form.control as unknown as Control<TFieldValues>
  });
  return { ...form, lens };
}
