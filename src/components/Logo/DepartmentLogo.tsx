import logoDipartimento from "../../assets/images/logo-dipartimento.png?format=webp;avif;png&as=picture";
import { pictureToImgProps } from "../../utils/vite-imagetools";

const DeparmentLogo = () => (
  <img
    {...pictureToImgProps(logoDipartimento)}
    className="img-fluid"
    style={{ maxHeight: "80px" }}
  />
);

export default DeparmentLogo;
