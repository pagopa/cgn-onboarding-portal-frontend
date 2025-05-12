import { ReactNode } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

type Props = {
  hasHeaderBorder?: boolean;
  children: ReactNode;
};

const Layout = ({ hasHeaderBorder = false, children }: Props) => (
  <>
    <Header hasBorder={hasHeaderBorder} />
    {children}
    <Footer />
  </>
);

export default Layout;
