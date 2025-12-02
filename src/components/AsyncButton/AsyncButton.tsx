import { Button as ButtonDesignKit, ButtonProps } from "design-react-kit";
import { PropsWithChildren } from "react";
import SmallSpinner from "../SmallSpinner/SmallSpinner";

type Props = PropsWithChildren & {
  isPending: boolean;
  fullwidth?: boolean;
} & ButtonProps;

const AsyncButton = ({
  children,
  isPending,
  fullwidth,
  className,
  disabled,
  ...rest
}: Props) => {
  const classNames = `${className} ${fullwidth ? "w-100" : ""}`.trim();
  return (
    <ButtonDesignKit
      type="submit"
      className={classNames}
      tag="button"
      disabled={disabled || isPending}
      {...rest}
    >
      <div className="d-flex align-items-center justify-content-center">
        {isPending && <SmallSpinner />}
        {children}
      </div>
    </ButtonDesignKit>
  );
};

export default AsyncButton;
