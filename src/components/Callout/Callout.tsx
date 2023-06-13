import { Icon } from "design-react-kit";
import React, { CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
  container: {
    filter: "drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.1))",
    position: "relative",
    borderRadius: "4px",
    border: "1px solid #FFFF",
    borderLeftWidth: "4px",
    padding: "1rem 1rem",
    marginBottom: "1rem"
  }
};

type CalloutType = "info" | "warning" | "danger";

type Props = {
  type: CalloutType;
  title: string;
  children?: React.ReactNode;
  body?: string;
};

const getColorByType = (type: CalloutType) => {
  switch (type) {
    case "danger":
      return "#D1344C";
    case "warning":
      return "#EA7614";
    case "info":
    default:
      return "#0073E6";
  }
};

const Callout = ({ title, body, type, children }: Props) => (
  <div
    style={{ ...styles.container, borderLeftColor: getColorByType(type) }}
    className="row bg-white"
  >
    <div className="col-1">
      <Icon icon="it-warning-circle" style={{ fill: getColorByType(type) }} />
    </div>
    <div className="col">
      <h6>{title}</h6>
      {body && <p style={{ color: "#5C6F82" }}>{body}</p>}
    </div>
    {children}
  </div>
);

export default Callout;
