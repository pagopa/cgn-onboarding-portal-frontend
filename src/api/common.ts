/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { authenticationStore } from "../authentication/authenticationStore";
import * as GeneratedPublic from "./generated_public";
import * as GeneratedIndex from "./generated";
import * as GeneratedBackoffice from "./generated_backoffice";

const API_DOMAIN =
  window.location.hostname === "localhost" // use vite proxy on dev machine
    ? ""
    : new URL(import.meta.env.CGN_API_URL).host;

export const API_PUBLIC_BASE_URL = `${API_DOMAIN}/public/v1`;

const PublicApi = {
  Help: new GeneratedPublic.HelpApi(undefined, API_PUBLIC_BASE_URL)
};

export const API_INDEX_BASE_URL = `${API_DOMAIN}/api/v1`;

const IndexApi = {
  Agreement: new GeneratedIndex.AgreementApi(undefined, API_INDEX_BASE_URL),
  Profile: new GeneratedIndex.ProfileApi(undefined, API_INDEX_BASE_URL),
  Discount: new GeneratedIndex.DiscountApi(undefined, API_INDEX_BASE_URL),
  Bucket: new GeneratedIndex.BucketApi(undefined, API_INDEX_BASE_URL),
  Document: new GeneratedIndex.DocumentApi(undefined, API_INDEX_BASE_URL),
  DocumentTemplate: new GeneratedIndex.DocumentTemplateApi(
    undefined,
    API_INDEX_BASE_URL
  ),
  ApiToken: new GeneratedIndex.ApiTokenApi(undefined, API_INDEX_BASE_URL),
  Help: new GeneratedIndex.HelpApi(undefined, API_INDEX_BASE_URL),
  GeolocationToken: new GeneratedIndex.GeolocationTokenApi(
    undefined,
    API_INDEX_BASE_URL
  ),
  DiscountBucketLoadingProgress:
    new GeneratedIndex.DiscountBucketLoadingProgressApi(
      undefined,
      API_INDEX_BASE_URL
    )
};

const API_BACKOFFICE_BASE_URL = `${API_DOMAIN}/backoffice/v1`;

const BackofficeApi = {
  Agreement: new GeneratedBackoffice.AgreementApi(
    undefined,
    API_BACKOFFICE_BASE_URL
  ),
  Discount: new GeneratedBackoffice.DiscountApi(
    undefined,
    API_BACKOFFICE_BASE_URL
  ),
  Document: new GeneratedBackoffice.DocumentApi(
    undefined,
    API_BACKOFFICE_BASE_URL
  ),
  Exports: new GeneratedBackoffice.ExportsApi(
    undefined,
    API_BACKOFFICE_BASE_URL
  ),
  AttributeAuthority: new GeneratedBackoffice.AttributeauthorityApi(
    undefined,
    API_BACKOFFICE_BASE_URL
  )
};

export const queryClient = new QueryClient({});

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
      try {
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
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          const data = authenticationStore.get();
          authenticationStore.deleteSession(data.currentSession);
          authenticationStore.setCurrentSession({ type: "none" });
          // eslint-disable-next-line functional/immutable-data
          window.location.href = "/";
        }
        throw error;
      }
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
    Object.getOwnPropertyNames(Object.getPrototypeOf(methods)).map(
      methodName => [
        methodName,
        makeReactQuery(
          [queryKeyNameLevel1, queryKeyNameLevel2, methodName],
          (...args) => methods[methodName](...args),
          getToken
        )
      ]
    )
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
  Index: mapApiMethods("Index", IndexApi, authenticationStore.getMerchantToken),
  Backoffice: mapApiMethods(
    "Backoffice",
    BackofficeApi,
    authenticationStore.getAdminToken
  )
};
