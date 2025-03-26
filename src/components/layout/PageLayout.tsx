
import React, { ReactNode } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
