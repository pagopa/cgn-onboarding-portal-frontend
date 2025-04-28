import * as Yup from "yup";
import { YupLiteral } from "./yupUtils";

export const EmptyAddresses = Yup.array(
  Yup.object({
    street: YupLiteral("").required(),
    zipCode: YupLiteral("").required(),
    city: YupLiteral("").required(),
    district: YupLiteral("").required(),
    coordinates: Yup.object({
      latitude: YupLiteral("").required(),
      longitude: YupLiteral("").required()
    }).required()
  }).required()
).required();

export type EmptyAddresses = Yup.InferType<typeof EmptyAddresses>;
