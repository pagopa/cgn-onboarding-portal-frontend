import { Lens, useLens } from "@hookform/lenses";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Control,
  FieldValues,
  useForm,
  UseFormProps,
  UseFormReturn
} from "react-hook-form";
import { ZodMiniType } from "zod/mini";

export function useStandardForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues
>(
  props: UseFormProps<TFieldValues, TContext, TTransformedValues> & {
    zodSchema: ZodMiniType<TTransformedValues, TFieldValues>;
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
