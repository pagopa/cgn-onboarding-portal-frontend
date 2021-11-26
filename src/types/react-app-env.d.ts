// <reference types="react-scripts" />

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: any;
  export default content;
}

declare module "*.csv" {
  const content: any;
  export default content;
}

declare module "*.pdf" {
  const content: any;
  export default content;
}

declare module "design-react-kit" {
  export { default as Badge } from "src/components/Badge/Badge.js";
}

declare module "src/components/Badge/Badge" {
  import * as React from "react";

  const Badge: React.FC;

  export default Badge;
}
