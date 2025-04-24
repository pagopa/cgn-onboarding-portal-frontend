import * as Yup from "yup";
import { MixedLocale } from "yup/lib/locale";

interface YupCustomSchema<In, C, Out = In> extends Yup.BaseSchema<In, C, Out> {
  required(
    msg?: MixedLocale["required"]
  ): YupCustomSchema<In, C, NonNullable<Out>>;
  nullable(isNullable?: true): YupCustomSchema<In | null, C>;
  nullable(isNullable: false): YupCustomSchema<Exclude<In, null>, C>;
}

export function YupLiteral<
  Literal extends string | number | boolean | null | undefined
>(literal: Literal): YupCustomSchema<Literal, any, Literal> {
  return Yup.mixed().oneOf([literal]);
}

export function YupUnion<Options extends Array<Yup.BaseSchema>>(
  options: Options,
  asynchronous: boolean = false
): YupCustomSchema<
  Yup.TypeOf<Options[number]>,
  any,
  Yup.InferType<Options[number]>
> {
  return Yup.mixed().test(
    "union",
    "Must match one of the provided schemas",
    asynchronous
      ? async function (obj) {
          const { path, createError } = this;
          for (const option of options) {
            try {
              await option.validate(obj);
              return true;
            } catch (err) {
              // Keep checking other options
            }
          }
          return createError({
            path,
            message: "Must match one of the provided schemas"
          });
        }
      : function (obj) {
          const { path, createError } = this;
          for (const option of options) {
            try {
              option.validateSync(obj);
              return true;
            } catch (err) {
              // Keep checking other options
            }
          }
          return createError({
            path,
            message: "Must match one of the provided schemas"
          });
        }
  ) as any;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function YupRecord<ValueSchema extends Yup.BaseSchema>(
  valueSchema: ValueSchema,
  asynchronous: boolean = false
): YupCustomSchema<
  Yup.TypeOf<ValueSchema>,
  any,
  Record<string, Yup.InferType<ValueSchema>>
> {
  return Yup.object().test(
    "record-sync",
    "All values must match the provided schema",
    asynchronous
      ? async function (obj) {
          const { path, createError } = this;
          if (typeof obj !== "object" || obj === null) {
            return createError({ path, message: "Must be a valid object" });
          }
          for (const [key, value] of Object.entries(obj)) {
            try {
              await valueSchema.validate(value);
            } catch (err) {
              return createError({
                path: `${path}.${key}`,
                message: (err as Yup.ValidationError).message
              });
            }
          }
          return true;
        }
      : function (obj) {
          const { path, createError } = this;
          if (typeof obj !== "object" || obj === null) {
            return createError({ path, message: "Must be a valid object" });
          }
          for (const [key, value] of Object.entries(obj)) {
            try {
              valueSchema.validateSync(value);
            } catch (err) {
              return createError({
                path: `${path}.${key}`,
                message: (err as Yup.ValidationError).message
              });
            }
          }
          return true;
        }
  ) as any;
}
