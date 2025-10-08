import { ReactNode } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default Layout;
