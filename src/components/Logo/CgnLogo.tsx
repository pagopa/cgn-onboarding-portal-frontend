import logoCgn from "../../assets/images/logo-cgn.png?w=112&h=132&format=webp;avif;png&as=picture";
import { pictureToImgProps } from "../../utils/vite-imagetools";

const CgnLogo = () => (
  <img
    {...pictureToImgProps(logoCgn)}
    style={{ width: "56px", height: "66px" }}
  />
);

export default CgnLogo;
