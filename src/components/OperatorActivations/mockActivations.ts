import {
  Organizations,
  OrganizationWithReferents
} from "../../api/generated_backoffice";

export const mockActivations: Organizations = {
  items: [
    {
      keyOrganizationFiscalCode: "1234567892",
      organizationFiscalCode: "1234567892",
      organizationName: "organization",
      pec: "organization@pec.it",
      insertedAt: "2022-03-25T16:31:26.079Z",
      referents: ["BBBBBB00B00B000C", "BBBBBB00B00B000D", "BBBBBB00B00B000E"]
    },
    {
      keyOrganizationFiscalCode: "1234567890",
      organizationFiscalCode: "1234567890",
      organizationName: "organization",
      pec: "organization@pec.it",
      insertedAt: "2022-03-28T10:08:16.633Z",
      referents: ["BBBBBB00B00B000A", "BBBBBB00B00B000B", "BBBBBB00B00B000C"]
    },
    {
      keyOrganizationFiscalCode: "1234567891",
      organizationFiscalCode: "1234567891",
      organizationName: "organization",
      pec: "organization@pec.it",
      insertedAt: "2022-03-28T10:08:16.633Z",
      referents: ["BBBBBB00B00B000B", "BBBBBB00B00B000C", "BBBBBB00B00B000D"]
    }
  ],
  count: 3
};
