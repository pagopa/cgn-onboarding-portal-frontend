import logoCgn from "../../assets/images/logo-cgn.png?w=112&h=136&format=webp;avif;png&as=picture";
import { pictureToImgProps } from "../../utils/vite-imagetools";

const CgnLogo = () => (
  <img
    {...pictureToImgProps(logoCgn)}
    style={{ width: "56px", height: "68px" }}
  />
);

export default CgnLogo;
