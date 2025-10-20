import { SalesChannel } from "../api/generated";

export function getDiscountTypeChecks(salesChannel: SalesChannel | undefined) {
  const onlineOrBoth =
    salesChannel?.channelType === "OnlineChannel" ||
    salesChannel?.channelType === "BothChannels";

  const checkStaticCode =
    onlineOrBoth &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    salesChannel?.discountCodeType === "Static";

  const checkLanding =
    onlineOrBoth &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    salesChannel?.discountCodeType === "LandingPage";

  const checkBucket =
    onlineOrBoth &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    salesChannel?.discountCodeType === "Bucket";

  return { checkStaticCode, checkLanding, checkBucket };
}
