import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/sidebars/sidebar";
import SidebarLeft from "@/components/sidebars/sidebarRight";
import Footer from "@/components/footer/Footer";
import DotGrid from "@/components/background/DotGrid";
import ScrollProgress from "@/components/ui/ScrollProgress";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <DotGrid />
      <Navbar />
      <SidebarLeft />
      <Sidebar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
