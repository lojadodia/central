import NavbarWithSearch from "@components/layout/navbar/navbar-with-search";
import MobileNavigation from "./mobile-navigation";
import Footer from "./footer";
import { ThemeProvider } from "next-themes";
const HomeLayout: React.FC = ({ children }) => {

  return (
    <ThemeProvider attribute="class" forcedTheme="dark">
      <div className="flex flex-col min-h-screen transition-colors duration-150">
        <NavbarWithSearch />
        {children}
        <MobileNavigation />
        <Footer />
      </div>
  </ThemeProvider>
  
  )
}

export default HomeLayout;
