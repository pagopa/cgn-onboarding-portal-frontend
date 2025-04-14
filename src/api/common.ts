import {
  QueryClient,
  UseQueryOptions,
  useQuery as reactQueryUseQuery,
  useMutation as reactQueryUseMutation,
  UseQueryResult,
  UseMutationOptions,
  UseMutationResult
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse, RawAxiosRequestConfig } from "axios";
import { on401 } from "../authentication/LoginRedirect";
import {
  getAdminToken,
  getMerchantToken
} from "../authentication/authenticationState";
import * as GeneratedPublic from "./generated_public";
import * as GeneratedIndex from "./generated";
import * as GeneratedBackoffice from "./generated_backoffice";

const PublicApi = {
  Help: new GeneratedPublic.HelpApi(undefined, process.env.BASE_PUBLIC_PATH)
};

const IndexApi = {
  Agreement: new GeneratedIndex.AgreementApi(
    undefined,
    process.env.BASE_API_PATH
  ),
  Profile: new GeneratedIndex.ProfileApi(undefined, process.env.BASE_API_PATH),
  Discount: new GeneratedIndex.DiscountApi(
    undefined,
    process.env.BASE_API_PATH
  ),
  Bucket: new GeneratedIndex.BucketApi(undefined, process.env.BASE_API_PATH),
  Document: new GeneratedIndex.DocumentApi(
    undefined,
    process.env.BASE_API_PATH
  ),
  DocumentTemplate: new GeneratedIndex.DocumentTemplateApi(
    undefined,
    process.env.BASE_API_PATH
  ),
  ApiToken: new GeneratedIndex.ApiTokenApi(
    undefined,
    process.env.BASE_API_PATH
  ),
  Help: new GeneratedIndex.HelpApi(undefined, process.env.BASE_API_PATH),
  GeolocationToken: new GeneratedIndex.GeolocationTokenApi(
    undefined,
    process.env.BASE_API_PATH
  ),
  DiscountBucketLoadingProgress:
    new GeneratedIndex.DiscountBucketLoadingProgressApi(
      undefined,
      process.env.BASE_API_PATH
    )
};

const BackofficeApi = {
  Agreement: new GeneratedBackoffice.AgreementApi(
    undefined,
    process.env.BASE_BACKOFFICE_PATH
  ),
  Discount: new GeneratedBackoffice.DiscountApi(
    undefined,
    process.env.BASE_BACKOFFICE_PATH
  ),
  Document: new GeneratedBackoffice.DocumentApi(
    undefined,
    process.env.BASE_BACKOFFICE_PATH
  ),
  Exports: new GeneratedBackoffice.ExportsApi(
    undefined,
    process.env.BASE_BACKOFFICE_PATH
  ),
  AttributeAuthority: new GeneratedBackoffice.AttributeauthorityApi(
    undefined,
    process.env.BASE_BACKOFFICE_PATH
  )
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: process.env.NODE_ENV === "production"
    }
  }
});

type VariablesOf<AxiosParams extends Array<any>> = AxiosParams extends [
  RawAxiosRequestConfig?
]
  ? undefined
  : AxiosParams extends [(infer V)?, RawAxiosRequestConfig?]
    ? V
    : undefined;

type QueryKeyType<Params> = [string, string, string, Params];

type ReactQueryHelpers<Params, Result> = {
  method(params: Params, config?: RawAxiosRequestConfig): Promise<Result>;
  queryKey(params: Params): QueryKeyType<Params>;
  queryFn({ queryKey }: { queryKey: QueryKeyType<Params> }): Promise<Result>;
  mutationFn(params: Params): Promise<Result>;
  invalidateQueries(params: Partial<Params>): void;
  queryOptions(params: Params): {
    queryKey: QueryKeyType<Params>;
    queryFn({ queryKey }: { queryKey: QueryKeyType<Params> }): Promise<Result>;
  };
  useQuery(
    params: Params,
    options?: Exclude<
      UseQueryOptions<Result, AxiosError<unknown>>,
      "queryKey" | "queryFn"
    >
  ): UseQueryResult<Result, AxiosError<unknown>>;
  useMutation(
    options?: Exclude<
      UseMutationOptions<Result, AxiosError<unknown>, Params>,
      "mutationFn"
    >
  ): UseMutationResult<Result, AxiosError<unknown>, Params>;
};

function makeReactQuery<AxiosParams extends Array<any>, Result>(
  methodName: [string, string, string],
  axiosMethod: (
    ...params: AxiosParams
  ) => Promise<AxiosResponse<Result, unknown>>,
  getToken: () => string
) {
  const self: ReactQueryHelpers<VariablesOf<AxiosParams>, Result> = {
    async method(params, config) {
      const configWithAuth = {
        ...(config ?? {}),
        headers: {
          ...(config?.headers ?? {}),
          Authorization: `Bearer ${getToken()}`
        }
      };

      const response = await axiosMethod(
        ...(params === undefined
          ? [configWithAuth]
          : ([params, configWithAuth] as any))
      );
      if (response instanceof AxiosError) {
        if (response?.response?.status === 401) {
          on401();
        }
        throw response;
      }
      return response.data;
    },
    queryKey(params) {
      return [...methodName, params] as QueryKeyType<VariablesOf<AxiosParams>>;
    },
    queryFn({ queryKey: [, , , params] }) {
      return self.method(params);
    },
    mutationFn(params) {
      return self.method(params);
    },
    invalidateQueries(params) {
      return queryClient.invalidateQueries(
        self.queryKey(params as VariablesOf<AxiosParams>) as any
      );
    },
    queryOptions(params) {
      return {
        queryKey: self.queryKey(params),
        queryFn: self.queryFn
      };
    },
    useQuery(params, options) {
      return reactQueryUseQuery({
        ...(options as Record<string, never>),
        queryKey: self.queryKey(params),
        queryFn: self.queryFn
      });
    },
    useMutation(options) {
      return reactQueryUseMutation({
        ...(options as Record<string, never>),
        mutationFn: self.mutationFn
      });
    }
  };
  return self;
}

function makeReactQueries<
  Methods extends Record<string, (...params: any) => Promise<any>>
>(
  queryKeyNameLevel1: string,
  queryKeyNameLevel2: string,
  methods: Methods,
  getToken: () => string
): {
  [M in keyof Methods]: ReactQueryHelpers<
    VariablesOf<Parameters<Methods[M]>>,
    Awaited<ReturnType<Methods[M]>>
  >;
} {
  return Object.fromEntries(
    Object.keys(Object.getPrototypeOf(methods)).map(methodName => [
      methodName,
      makeReactQuery(
        [queryKeyNameLevel1, queryKeyNameLevel2, methodName],
        (...args) => methods[methodName](...args),
        getToken
      )
    ])
  ) as any;
}

function mapApiMethods<
  Obj extends {
    [K in keyof Obj]: {
      [I in keyof Obj[K]]: (
        ...params: Array<any>
      ) => Promise<AxiosResponse<any, any>>;
    };
  }
>(
  queryKeyNameLevel1: string,
  obj: Obj,
  getToken: () => string
): {
  [K in keyof Obj]: {
    [M in keyof Obj[K]]: ReactQueryHelpers<
      VariablesOf<Parameters<Obj[K][M]>>,
      Awaited<ReturnType<Obj[K][M]>>["data"]
    >;
  };
} {
  return Object.fromEntries(
    Object.entries(obj as any).map(([key, value]) => [
      key,
      makeReactQueries(queryKeyNameLevel1, key, value as any, getToken)
    ])
  ) as any;
}

export const remoteData = {
  Public: mapApiMethods("Public", PublicApi, () => ""),
  Index: mapApiMethods("Index", IndexApi, getMerchantToken),
  Backoffice: mapApiMethods("Backoffice", BackofficeApi, getAdminToken)
};
