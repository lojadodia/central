import Logo from "@components/ui/logo";
import { useUI } from "@contexts/ui.context";
import AuthorizedMenu from "./authorized-menu";
import Drawer from "@components/ui/drawer";
import LinkButton from "@components/ui/link-button";
import { NavbarIcon } from "@components/icons/navbar-icon";
import { motion } from "framer-motion";
import DrawerWrapper from "@components/ui/drawer-wrapper";
import SidebarMenu from "@components/ui/sidebar-menu";
import { useMeQuery } from "@data/user/use-me.query";
import { ROUTES } from "@utils/routes";
const Navbar = () => {
  const { toggleSidebar, displaySidebar, closeSidebar } = useUI();

  const user : any  = useMeQuery();
  const permission = user['data']?.permission;

  

  if(permission == "super_admin"){
    var MENU_SETTINGS : any = { href: ROUTES.SETTINGS, label: "Definições", icon: "SettingsIcon" };
  }else{
    var MENU_SETTINGS : any = {};
  }

  if(permission == "super_admin" || permission == "admin" || permission == "billing" || permission == "logistics"){
    var MENU_ORDERS : any = { href: ROUTES.ORDERS, label: "Pedidos", icon: "OrdersIcon" };
  }else{
    var MENU_ORDERS : any = {};
  }

  if(permission == "super_admin" || permission == "admin" || permission == "stock"){
    var MENU_CATEGORIES : any = { href: ROUTES.CATEGORIES, label: "Categorias", icon: "CategoriesIcon" };
    var MENU_PRODUCTS : any = { href: ROUTES.PRODUCTS, label: "Produtos", icon: "ProductsIcon" };
    var MENU_EXTRA : any = { href: ROUTES.ATTRIBUTES, label: "Extras", icon: "AttributeIcon" };
  }else{
    var MENU_CATEGORIES : any = {};
    var MENU_PRODUCTS : any = {};
    var MENU_EXTRA : any = {};
  }

  if(permission == "super_admin" || permission == "admin" || permission == "billing" || permission == "logistics"){
    var MENU_WEEKLY : any = { href: ROUTES.WEEKLY_MENU, label: "Programação", icon: "OrdersStatusIcon" };
  }else{
    var MENU_WEEKLY : any = {};
  }
  if(permission == "super_admin" || permission == "admin" || permission == "billing"){
    var MENU_CLIENTS : any = { href: ROUTES.CUSTOMERS, label: "Utilizadores", icon: "UsersIcon" };
  }else{
    var MENU_CLIENTS : any = {};
  }
  if(permission == "super_admin" || permission == "admin" || permission == "billing"){
    var MENU_INVOICES : any = { href: ROUTES.INVOICES, label: "Financeiro", icon: "TaxesIcon" };
  }else{
    var MENU_INVOICES : any = {};
  }
  if(permission == "super_admin"){
    var MENU_SETTINGS : any = { href: ROUTES.SETTINGS, label: "Definições", icon: "SettingsIcon" };
  }else{
    var MENU_SETTINGS : any = {};
  }


  const siteSettings = {
    sidebarLinks: [
      {
        href: ROUTES.DASHBOARD,
        label: "Dashboard",
        icon: "DashboardIcon",
      },
      MENU_ORDERS,
      MENU_CATEGORIES,
      MENU_PRODUCTS,
      MENU_EXTRA,
      MENU_WEEKLY,
      MENU_CLIENTS,
      MENU_INVOICES,
      MENU_SETTINGS,
    ],
  };

  return (
    <header className="bg-white shadow fixed w-full z-40">
      <nav className="px-5 md:px-8 py-2 flex items-center justify-between">
        {/* <!-- Mobile menu button --> */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={toggleSidebar}
          className="flex p-2 h-full items-center justify-center focus:outline-none focus:text-primary lg:hidden"
        >
          <NavbarIcon />
        </motion.button>

        <div className="hidden md:flex ml-5 mr-auto">
          <Logo />
        </div>

        <Drawer open={displaySidebar} onClose={closeSidebar} variant="left">
          <DrawerWrapper onClose={closeSidebar}>
            <SidebarMenu
              items={siteSettings?.sidebarLinks}
              className="px-5 py-3"
            />
          </DrawerWrapper>
        </Drawer>

        <div className="flex items-center space-x-8">
          {(permission == "super_admin" || permission == "admin" || permission == "stock") && (
            <LinkButton
              href="/products/create"
              className="ml-4 md:ml-6"
              size="small"
            >
            Adicionar Produtos
            </LinkButton>
          )}
          <AuthorizedMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
