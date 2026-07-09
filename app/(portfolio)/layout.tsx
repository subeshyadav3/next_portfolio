import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebars/sidebar";
import SidebarLeft from "../../components/sidebars/sidebarRight";
import Footer from "../../components/footer/Footer";
import SmoothScrollProvider from "../../providers/SmoothScrollProvider";
import DotGrid from "../../components/background/DotGrid";
import CustomCursor from "../../components/cursor/CustomCursor";
import ScrollProgress from "../../components/ui/ScrollProgress";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <DotGrid />
      <CustomCursor />
      <Navbar />
      <SidebarLeft />
      <Sidebar />
      <main>{children}</main>
      <Footer />
    </SmoothScrollProvider>
  );
}
