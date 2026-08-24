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
  DraftAgreement,
  PendingAgreement,
  RejectedAgreement
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

type WithChannel<T, C> = Omit<T, "channelType"> & { channelType: C };

/** Use this type instead of SalesChannel generated type since the generated type is not fully correct */
export type NormalizedSalesChannel =
  | WithChannel<OnlineChannel, typeof SalesChannelType.OnlineChannel>
  | WithChannel<
      NormalizedAddresses<OfflineChannel>,
      typeof SalesChannelType.OfflineChannel
    >
  | WithChannel<
      NormalizedAddresses<BothChannels>,
      typeof SalesChannelType.BothChannels
    >;

/** Use this type instead of Agreement generated type since the generated type is not fully correct */
type WithState<T, S> = Omit<T, "state"> & { state: S };
export type NormalizedBackofficeAgreement =
  | WithState<DraftAgreement, typeof AgreementState.DraftAgreement>
  | WithState<AssignedAgreement, typeof AgreementState.AssignedAgreement>
  | WithState<PendingAgreement, typeof AgreementState.PendingAgreement>
  | WithState<RejectedAgreement, typeof AgreementState.RejectedAgreement>;
