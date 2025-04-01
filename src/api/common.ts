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
import PublicApi from "./public";
import BackofficeApi from "./backoffice";
import IndexApi from "./index";

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
  method(params: Params): Promise<Result>;
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
  ) => Promise<AxiosResponse<Result, unknown>>
) {
  const self: ReactQueryHelpers<VariablesOf<AxiosParams>, Result> = {
    async method(params) {
      const response = await axiosMethod(...([params] as any));
      if (response instanceof AxiosError) {
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
  methods: Methods
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
        (...args) => methods[methodName](...args)
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
  obj: Obj
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
      makeReactQueries(queryKeyNameLevel1, key, value as any)
    ])
  ) as any;
}

export const remoteData = {
  Index: mapApiMethods("Index", IndexApi),
  Backoffice: mapApiMethods("Backoffice", BackofficeApi),
  Public: mapApiMethods("Public", PublicApi)
};
