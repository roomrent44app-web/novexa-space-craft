import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import InstallPrompt from "./InstallPrompt";
import { useAllImagesPreload } from "@/hooks/useAllImagesPreload";

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  useAllImagesPreload(pathname);
  if (pathname === "/admin") return <div className="min-h-screen">{children}</div>;
  if (pathname === "/dashboard") return <div className="dashboard-layout">{children}<BottomNav /><InstallPrompt /></div>;
  return <div className="min-h-screen"><Header /><main>{children}</main><Footer /><BottomNav /><InstallPrompt /></div>;
}
