import { BothChannels } from "../api/generated";
import { ApprovedAgreementProfile } from "../api/generated_backoffice";

export function getDiscountTypeChecks(
  profile: Pick<ApprovedAgreementProfile, "salesChannel"> | undefined
) {
  const salesChannel = profile?.salesChannel as BothChannels | undefined;

  const onlineOrBoth =
    salesChannel?.channelType === "OnlineChannel" ||
    salesChannel?.channelType === "BothChannels";

  const checkStaticCode =
    onlineOrBoth && salesChannel?.discountCodeType === "Static";

  const checkLanding =
    onlineOrBoth && salesChannel?.discountCodeType === "LandingPage";

  const checkBucket =
    onlineOrBoth && salesChannel?.discountCodeType === "Bucket";

  return { checkStaticCode, checkLanding, checkBucket };
}
