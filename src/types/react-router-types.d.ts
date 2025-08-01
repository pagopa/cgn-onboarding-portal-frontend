import {
  Register,
  NavigateOptions,
  LinkProps,
  NavLinkProps,
  NavigateProps,
  RouteProps
} from "react-router";

// this file serves to add a bit more type safety to react-router
// it does NOT cover all typings
// if react-router library will tighten typings in newer versions, update or delete this file accordingly

type Pages = Register["pages"];
type Args = {
  [K in keyof Pages]: ToArgs<Pages[K]["params"]>;
};
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;
type ToArgs<Params extends Record<string, string | undefined>> =
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Equal<Params, {}> extends true
    ? []
    : Partial<Params> extends Params
      ? [Params] | []
      : [Params];

declare module "react-router" {
  /** This is a special type to ensure type safety */
  type SafePathname = {
    _: `Use href() from "react-router" to create a valid object of this kind`;
  };

  function href<Path extends keyof Args>(
    path: Path,
    ...args: Args[Path]
  ): SafePathname;

  function useNavigate(): {
    (to: SafePathname, options?: NavigateOptions): void; // originally void | Promise<void>;
    (delta: number): void; // originally void | Promise<void>;
  };

  const Link: React.ForwardRefExoticComponent<
    Omit<LinkProps, "to"> & {
      to: SafePathname;
    } & React.RefAttributes<HTMLAnchorElement>
  >;

  const NavLink: React.ForwardRefExoticComponent<
    Omit<NavLinkProps, "to"> & {
      to: SafePathname;
    } & React.RefAttributes<HTMLAnchorElement>
  >;

  function Navigate(
    props: Omit<NavigateProps, "to"> & {
      to: SafePathname;
    }
  ): null;

  function Route(
    _props: Omit<RouteProps, "path"> & { path: SafePathname }
  ): React.ReactElement | null;

  const redirect: (url: SafePathname, init?: number | ResponseInit) => Response;
}
