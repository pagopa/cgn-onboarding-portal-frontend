import { AxiosResponse } from "axios";
import { fromPredicate } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";

/**
 * @deprecated use normalizeAxiosResponse instead
 */
const chainAxios = (response: AxiosResponse) =>
  fromPredicate(
    (_: AxiosResponse) => _.status === 200 || _.status === 204,
    toError
  )(response);

export default chainAxios;
