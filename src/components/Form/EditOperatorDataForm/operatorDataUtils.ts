import {
  BothChannels,
  OfflineChannel,
  OnlineChannel,
  SalesChannel
} from "../../../api/generated";
import { EmptyAddresses } from "../../../utils/form_types";
import {
  clearIfReferenceIsBlank,
  withNormalizedSpaces
} from "../../../utils/strings";

// WARNING: this file is 90% duplicated with src/components/Form/CreateProfileForm/ProfileData/ProfileData.tsx
// any changes here should be reflected there as well

export const defaultSalesChannel = {
  channelType: "",
  websiteUrl: "",
  discountCodeType: "",
  allNationalAddresses: false,
  addresses: [{ street: "", zipCode: "", city: "", district: "" }]
};

export const profileDefaultInitialValues = {
  fullName: "",
  hasDifferentFullName: false,
  name: "",
  name_en: "",
  name_de: "-",
  pecAddress: "",
  taxCodeOrVat: "",
  legalOffice: "",
  telephoneNumber: "",
  legalRepresentativeFullName: "",
  legalRepresentativeTaxCode: "",
  referent: {
    firstName: "",
    lastName: "",
    role: "",
    emailAddress: "",
    telephoneNumber: ""
  },
  secondaryReferents: [],
  description: "",
  description_en: "",
  description_de: "-",
  salesChannel: defaultSalesChannel
};
function getSalesChannel(
  salesChannel: SalesChannel & OnlineChannel & OfflineChannel & BothChannels
) {
  switch (salesChannel.channelType) {
    case "OnlineChannel": {
      const { addresses, ...OnlineChannel } = salesChannel;
      return OnlineChannel;
    }
    case "OfflineChannel": {
      const { websiteUrl, discountCodeType, ...OfflineChannel } = salesChannel;
      return {
        ...OfflineChannel,
        addresses:
          EmptyAddresses.safeParse(OfflineChannel.addresses).success ||
          OfflineChannel.allNationalAddresses
            ? []
            : OfflineChannel.addresses.map((add: any) => ({
                fullAddress: `${add.street}, ${add.city}, ${add.district}, ${add.zipCode}`,
                coordinates: add.coordinates
              }))
      };
    }
    case "BothChannels": {
      return {
        ...salesChannel,
        addresses:
          EmptyAddresses.safeParse(salesChannel.addresses).success ||
          salesChannel.allNationalAddresses
            ? []
            : salesChannel.addresses.map((add: any) => ({
                fullAddress: `${add.street}, ${add.city}, ${add.district}, ${add.zipCode}`,
                coordinates: add.coordinates
              }))
      };
    }
  }
}

export function sanitizeProfileFromValues(values: any) {
  const { hasDifferentFullName, ...profile } = values;
  const cleanedIfNameIsBlank = clearIfReferenceIsBlank(profile.name);
  return {
    ...profile,
    name: !hasDifferentFullName ? "" : cleanedIfNameIsBlank(profile.name),
    name_en: !hasDifferentFullName ? "" : cleanedIfNameIsBlank(profile.name_en),
    name_de: !hasDifferentFullName ? "" : cleanedIfNameIsBlank(profile.name_de),
    description: withNormalizedSpaces(profile.description),
    description_en: withNormalizedSpaces(profile.description_en),
    description_de: withNormalizedSpaces(profile.description_de),
    salesChannel: getSalesChannel(profile.salesChannel)
  };
}
