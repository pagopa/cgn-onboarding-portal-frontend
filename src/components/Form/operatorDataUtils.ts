import {
  Address,
  DiscountCodeType,
  Profile,
  SalesChannelType,
  UpdateProfile
} from "../../api/generated";
import {
  clearIfReferenceIsBlank,
  withNormalizedSpaces
} from "../../utils/strings";
import { FixedSalesChannel } from "../../api/dtoTypeFixes";
import { EmptyAddresses } from "./ValidationSchemas";

export type ProfileFormValues = {
  hasDifferentName: boolean;
  name: string;
  name_en: string;
  name_de: string;
  pecAddress: string;
  legalOffice: string;
  telephoneNumber: string;
  legalRepresentativeFullName: string;
  legalRepresentativeTaxCode: string;
  referent: ReferentFormValues;
  description: string;
  description_en: string;
  description_de: string;
  salesChannel: SalesChannelFormValues;
  secondaryReferents: Array<ReferentFormValues>;
};

type ReferentFormValues = {
  firstName: string;
  lastName: string;
  role: string;
  emailAddress: string;
  telephoneNumber: string;
};

type SalesChannelFormValues = {
  channelType: SalesChannelType | undefined;
  websiteUrl: string;
  discountCodeType: DiscountCodeType | undefined;
  allNationalAddresses: boolean;
  addresses: Array<AddressFormValues>;
};

type AddressFormValues = {
  street: string;
  zipCode: string;
  city: string;
  district: string;
  coordinates:
    | {
        latitude: number;
        longitude: number;
      }
    | undefined;
};

const emptyAddressFormValues: AddressFormValues = {
  city: "",
  district: "",
  street: "",
  zipCode: "",
  coordinates: undefined
};

const salesChannelInitialFormValues: SalesChannelFormValues = {
  channelType: undefined,
  websiteUrl: "",
  discountCodeType: undefined,
  allNationalAddresses: false,
  addresses: [emptyAddressFormValues]
};

const profileInitialFormValues: ProfileFormValues = {
  hasDifferentName: false,
  name: "",
  name_en: "",
  name_de: "-",
  pecAddress: "",
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
  salesChannel: salesChannelInitialFormValues
};

function salesChannelFormValuesToAddresses(
  values: SalesChannelFormValues
): Array<Address> {
  if (
    EmptyAddresses.safeParse(values.addresses).success ||
    values.allNationalAddresses
  ) {
    return [];
  }
  return values.addresses.map(value => ({
    fullAddress: `${value.street}, ${value.city}, ${value.district}, ${value.zipCode}`,
    coordinates: value.coordinates
  }));
}

function salesChannelFormValuesToSalesChannel(
  values: SalesChannelFormValues
): FixedSalesChannel {
  switch (values.channelType) {
    case "OnlineChannel": {
      return {
        channelType: SalesChannelType.OnlineChannel,
        websiteUrl: values.websiteUrl,
        discountCodeType: values.discountCodeType as DiscountCodeType
      };
    }
    case "OfflineChannel": {
      return {
        channelType: SalesChannelType.OfflineChannel,
        websiteUrl: values.websiteUrl,
        addresses: salesChannelFormValuesToAddresses(values),
        allNationalAddresses: values.allNationalAddresses
      };
    }
    case "BothChannels": {
      return {
        channelType: SalesChannelType.BothChannels,
        websiteUrl: values.websiteUrl,
        addresses: salesChannelFormValuesToAddresses(values),
        allNationalAddresses: values.allNationalAddresses,
        discountCodeType: values.discountCodeType as DiscountCodeType
      };
    }
    default: {
      throw new Error("Invalid sales channel type");
    }
  }
}

function salesChannelToAdressesFormValues(
  salesChannel: FixedSalesChannel
): Array<AddressFormValues> {
  if (
    salesChannel.channelType === SalesChannelType.OfflineChannel ||
    salesChannel.channelType === SalesChannelType.BothChannels
  ) {
    if (salesChannel.allNationalAddresses) {
      return [emptyAddressFormValues];
    }
    return salesChannel.addresses.map(address => {
      const addressSplit = address.fullAddress
        .split(",")
        .map((item: string) => item.trim());
      return {
        street: addressSplit[0] ?? "",
        city: addressSplit[1] ?? "",
        district: addressSplit[2] ?? "",
        zipCode: addressSplit[3] ?? "",
        coordinates: address.coordinates
      };
    });
  } else {
    return [emptyAddressFormValues];
  }
}

function salesChannelToFormValues(
  salesChannel: FixedSalesChannel
): SalesChannelFormValues {
  switch (salesChannel.channelType) {
    case "OnlineChannel": {
      return {
        channelType: SalesChannelType.OnlineChannel,
        websiteUrl: salesChannel.websiteUrl,
        discountCodeType: salesChannel.discountCodeType,
        allNationalAddresses: false,
        addresses: salesChannelToAdressesFormValues(salesChannel)
      };
    }
    case "OfflineChannel": {
      return {
        channelType: SalesChannelType.OfflineChannel,
        websiteUrl: salesChannel.websiteUrl ?? "",
        discountCodeType: undefined,
        allNationalAddresses: salesChannel.allNationalAddresses ?? false,
        addresses: salesChannelToAdressesFormValues(salesChannel)
      };
    }
    case "BothChannels": {
      return {
        channelType: SalesChannelType.BothChannels,
        websiteUrl: salesChannel.websiteUrl,
        discountCodeType: salesChannel.discountCodeType,
        allNationalAddresses: salesChannel.allNationalAddresses ?? false,
        addresses: salesChannelToAdressesFormValues(salesChannel)
      };
    }
  }
}

export function profileToProfileFormValues(
  profile: Profile | undefined
): ProfileFormValues {
  if (!profile) {
    return profileInitialFormValues;
  }
  const cleanedIfNameIsBlank = clearIfReferenceIsBlank(profile.name);
  return {
    hasDifferentName: !!profile.name,
    name: cleanedIfNameIsBlank(profile.name),
    name_en: cleanedIfNameIsBlank(profile.name_en),
    name_de: "-",
    pecAddress: profile.pecAddress,
    legalOffice: profile.legalOffice,
    telephoneNumber: profile.telephoneNumber,
    legalRepresentativeFullName: profile.legalRepresentativeFullName,
    legalRepresentativeTaxCode: profile.legalRepresentativeTaxCode,
    referent: {
      firstName: profile.referent.firstName,
      lastName: profile.referent.lastName,
      role: profile.referent.role,
      emailAddress: profile.referent.emailAddress,
      telephoneNumber: profile.referent.telephoneNumber
    },
    description: withNormalizedSpaces(profile.description),
    description_en: withNormalizedSpaces(profile.description_en),
    description_de: "-",
    salesChannel: salesChannelToFormValues(
      profile.salesChannel as FixedSalesChannel
    ),
    secondaryReferents:
      profile.secondaryReferents?.map(referent => ({
        firstName: referent.firstName,
        lastName: referent.lastName,
        role: referent.role,
        emailAddress: referent.emailAddress,
        telephoneNumber: referent.telephoneNumber
      })) ?? []
  };
}

export function profileFormValuesToRequest(
  values: ProfileFormValues
): UpdateProfile {
  const cleanedIfNameIsBlank = clearIfReferenceIsBlank(values.name);
  return {
    name: !values.hasDifferentName ? "" : cleanedIfNameIsBlank(values.name),
    name_en: !values.hasDifferentName
      ? ""
      : cleanedIfNameIsBlank(values.name_en),
    name_de: !values.hasDifferentName
      ? ""
      : cleanedIfNameIsBlank(values.name_de),
    pecAddress: values.pecAddress,
    legalOffice: values.legalOffice,
    telephoneNumber: values.telephoneNumber,
    legalRepresentativeFullName: values.legalRepresentativeFullName,
    legalRepresentativeTaxCode: values.legalRepresentativeTaxCode,
    referent: {
      firstName: values.referent.firstName,
      lastName: values.referent.lastName,
      role: values.referent.role,
      emailAddress: values.referent.emailAddress,
      telephoneNumber: values.referent.telephoneNumber
    },
    description: withNormalizedSpaces(values.description),
    description_en: withNormalizedSpaces(values.description_en),
    description_de: withNormalizedSpaces(values.description_de),
    salesChannel: salesChannelFormValuesToSalesChannel(values.salesChannel),
    secondaryReferents: values.secondaryReferents.map(referent => ({
      firstName: referent.firstName,
      lastName: referent.lastName,
      role: referent.role,
      emailAddress: referent.emailAddress,
      telephoneNumber: referent.telephoneNumber
    }))
  };
}
