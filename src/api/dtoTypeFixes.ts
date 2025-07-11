import {
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

export type FixedSalesChannel =
  | ({ channelType: typeof SalesChannelType.OnlineChannel } & Omit<
      OnlineChannel,
      "channelType"
    >)
  | ({ channelType: typeof SalesChannelType.OfflineChannel } & Omit<
      OfflineChannel,
      "channelType"
    >)
  | ({ channelType: typeof SalesChannelType.BothChannels } & Omit<
      BothChannels,
      "channelType"
    >);

export type FixedBackofficeAgreement =
  | ({ state: typeof AgreementState.AssignedAgreement } & Omit<
      AssignedAgreement,
      "state"
    >)
  | ({ state: typeof AgreementState.PendingAgreement } & Omit<
      PendingAgreement,
      "state"
    >);
