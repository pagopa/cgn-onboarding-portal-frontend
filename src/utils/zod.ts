import { z } from "zod";

export const zodLiteral = <T extends string>(value: T) => z.literal(value);
