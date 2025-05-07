import Header from "../Header/Header";
import Footer from "../Footer/Footer";

type Props = {
  hasHeaderBorder?: boolean;
  children: any;
};

const Layout = ({ hasHeaderBorder = false, children }: Props) => (
  <>
    <Header hasBorder={hasHeaderBorder} />
    {children}
    <Footer />
  </>
);

export default Layout;
