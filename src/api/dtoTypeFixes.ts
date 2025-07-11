import {
  BothChannels,
  OfflineChannel,
  OnlineChannel,
  SalesChannelType
} from "./generated";

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
