import React from "react";
import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children: any;
};

const Layout = ({ children }: Props) => (
  <div className="grid bg-background">
    <Header />
    {children}
    <Footer />
  </div>
);

export default Layout;
