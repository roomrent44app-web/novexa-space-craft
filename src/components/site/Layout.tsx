import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  const showFooter = !["/", "/plans", "/how-it-works", "/faqs", "/about"].includes(pathname);
  return <div className="min-h-screen"><Header /><main>{children}</main>{showFooter && <Footer />}</div>;
}
