"use client";
import dynamic from "next/dynamic";
import Navbar from "../../components/navbar/navbar";
import SmoothScrollProvider from "../../providers/SmoothScrollProvider";

const Sidebar = dynamic(() => import("../../components/sidebars/sidebar"), {
  ssr: false,
});
const SidebarLeft = dynamic(
  () => import("../../components/sidebars/sidebarRight"),
  { ssr: false }
);
const Footer = dynamic(() => import("../../components/footer/Footer"), {
  ssr: false,
});
const DotGrid = dynamic(() => import("../../components/background/DotGrid"), {
  ssr: false,
});
const CustomCursor = dynamic(
  () => import("../../components/cursor/CustomCursor"),
  { ssr: false }
);
const ScrollProgress = dynamic(
  () => import("../../components/ui/ScrollProgress"),
  { ssr: false }
);

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <DotGrid />
      <CustomCursor />
      <Navbar />
      <SidebarLeft />
      <Sidebar />
      <main id="main-content">{children}</main>
      <Footer />
    </SmoothScrollProvider>
  );
}
