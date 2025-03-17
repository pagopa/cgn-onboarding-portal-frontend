import { Profile } from "../api/generated";

export function getDiscountTypeChecks(profile: Profile | undefined) {
  const onlineOrBoth =
    profile?.salesChannel?.channelType === "OnlineChannel" ||
    profile?.salesChannel?.channelType === "BothChannels";

  const checkStaticCode =
    onlineOrBoth &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    profile?.salesChannel?.discountCodeType === "Static";

  const checkLanding =
    onlineOrBoth &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    profile?.salesChannel?.discountCodeType === "LandingPage";

  const checkBucket =
    onlineOrBoth &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    profile?.salesChannel?.discountCodeType === "Bucket";

  return { checkStaticCode, checkLanding, checkBucket };
}
