import { test, expect } from "vitest";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SalesChannelValidationSchema } from "../components/Form/ValidationSchemas";

test("websiteUrl empty or valid", async () => {
  const INCORRECT_WEBSITE_URL =
    "L’indirizzo inserito non è corretto, inserire la URL comprensiva di protocollo";
  const schema = z.object({
    websiteUrl: SalesChannelValidationSchema.shape.websiteUrl
  });

  type AssertEqual<A, B> = A extends B ? (B extends A ? true : false) : false;
  function assertEqualTypes<A, B>(is: AssertEqual<A, B>) {
    return is;
  }
  type InputType = z.input<typeof schema>;
  type OutputType = z.output<typeof schema>;
  assertEqualTypes<InputType, { websiteUrl?: string }>(true);
  assertEqualTypes<OutputType, { websiteUrl?: string }>(true);

  // we use zodResolver since it is used to choose what error messages to display in forms
  async function validate(values: z.input<typeof schema>) {
    return await zodResolver(schema)(values, undefined, {
      shouldUseNativeValidation: false,
      fields: {}
    });
  }

  expect(await validate({})).toEqual({
    errors: {},
    values: {}
  });
  expect(await validate({ websiteUrl: undefined })).toEqual({
    errors: {},
    values: {}
  });
  expect(await validate({ websiteUrl: "" })).toEqual({
    errors: {},
    values: {}
  });
  expect(await validate({ websiteUrl: "  " })).toEqual({
    errors: {},
    values: {}
  });
  expect(await validate({ websiteUrl: "ciao" })).toEqual({
    errors: {
      "": {
        message: INCORRECT_WEBSITE_URL,
        ref: undefined,
        type: "invalid_format"
      },
      websiteUrl: {
        message: INCORRECT_WEBSITE_URL,
        ref: undefined,
        type: "invalid_format"
      }
    },
    values: {}
  });
  expect(await validate({ websiteUrl: "https://ciao.com" })).toEqual({
    errors: {},
    values: { websiteUrl: "https://ciao.com" }
  });
});
