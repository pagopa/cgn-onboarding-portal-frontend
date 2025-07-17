import { z } from "zod/v4";

z.config({ jitless: true }); // this is needed for CSP errors

// Inspired by https://github.com/robertLichtnow/zod-formik-adapter

/**
 * @example <Formik validationSchema={zodSchemaToFormikValidationSchema(myZodSchema)}>
 */
export function zodSchemaToFormikValidationSchema<V, T>(
  schemaFactory: (values: V) => z.ZodSchema<T>,
  params?: Partial<z.core.ParseContext<z.core.$ZodIssue>>
) {
  return {
    async validate(obj: V) {
      try {
        schemaFactory(obj).parse(obj, params);
      } catch (error: unknown) {
        const { message, issues } = error as z.ZodError<T>;
        const validationError = new Error(message) as Error & {
          inner: Array<{ path: string; message: string }>;
        };
        // eslint-disable-next-line functional/immutable-data
        validationError.name = "ValidationError";
        // eslint-disable-next-line functional/immutable-data
        validationError.inner = issues.map(({ message, path }) => ({
          message,
          path: path.join(".")
        }));
        throw validationError;
      }
    }
  };
}

// /**
//  * @example <Formik validate={zodSchemaToFormikValidate(myZodSchema)}>
//  */
// export function zodSchemaToFormikValidate<T>(
//   schema: z.ZodSchema<T>,
//   params?: Partial<z.ParseParams>
// ) {
//   return async function validate(values: T) {
//     const result = await schema.safeParseAsync(values, params);
//     if (!result.success) {
//       return Object.fromEntries(
//         result.error.errors.map(({ path, message }) => {
//           return [path.join("."), message];
//         })
//       );
//     }
//   };
// }
