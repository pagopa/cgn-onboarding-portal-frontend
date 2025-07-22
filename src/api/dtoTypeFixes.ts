import {
  Address,
  BothChannels,
  OfflineChannel,
  OnlineChannel,
  SalesChannelType
} from "./generated";
import {
  AgreementState,
  AssignedAgreement,
  PendingAgreement
} from "./generated_backoffice";

type NormalizedAddresses<S> = Omit<S, "addresses"> & {
  addresses: Array<NormalizedAddress>;
};

type NormalizedAddress = Omit<Address, "coordinates"> & {
  coordinates?: NormalizedCoordinates;
};

type NormalizedCoordinates = {
  longitude: number | null;
  latitude: number | null;
};

/** Use this type instead of SalesChannel generated type since the generated type is not fully correct */
export type NormalizedSalesChannel =
  | ({ channelType: typeof SalesChannelType.OnlineChannel } & Omit<
      OnlineChannel,
      "channelType"
    >)
  | ({ channelType: typeof SalesChannelType.OfflineChannel } & Omit<
      NormalizedAddresses<OfflineChannel>,
      "channelType"
    >)
  | ({ channelType: typeof SalesChannelType.BothChannels } & Omit<
      NormalizedAddresses<BothChannels>,
      "channelType"
    >);

/** Use this type instead of Agreement generated type since the generated type is not fully correct */
export type NormalizedBackofficeAgreement =
  | ({ state: typeof AgreementState.AssignedAgreement } & Omit<
      AssignedAgreement,
      "state"
    >)
  | ({ state: typeof AgreementState.PendingAgreement } & Omit<
      PendingAgreement,
      "state"
    >);
