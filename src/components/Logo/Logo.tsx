import logoPagopa from "../../assets/images/logo-pagopa.png?w=236&h=66&format=webp;avif;png&as=picture";
import { pictureToImgProps } from "../../utils/vite-imagetools";

const Logo = () => (
  <img
    {...pictureToImgProps(logoPagopa)}
    style={{ width: "118px", height: "33px" }}
  />
);

export default Logo;
