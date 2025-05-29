import logoDipartimento from "../../assets/images/logo-dipartimento.png?w=900&h=160&format=webp;avif;png&as=picture";
import { pictureToImgProps } from "../../utils/vite-imagetools";

const DeparmentLogo = () => (
  <img
    {...pictureToImgProps(logoDipartimento)}
    style={{ width: "450px", height: "80px" }}
  />
);

export default DeparmentLogo;
