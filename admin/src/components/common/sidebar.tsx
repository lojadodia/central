import SidebarMenu from "@components/ui/sidebar-menu";
import { useMeQuery } from "@data/user/use-me.query";
import { ROUTES } from "@utils/routes";


const Sidebar = () => {

  const { data } = useMeQuery();
  const permission = data?.permission;
  

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
    var MENU_EXTRA : any = { href: ROUTES.ATTRIBUTES, label: "Composições", icon: "AttributeIcon" };
  }else{
    var MENU_CATEGORIES : any = {};
    var MENU_PRODUCTS : any = {};
    var MENU_EXTRA : any = {};
  }

  if(permission == "super_admin" || permission == "admin" || permission == "billing" || permission == "logistics"){
    var MENU_WEEKLY : any = { href: ROUTES.WEEKLY_MENU, label: "Menús da Semana", icon: "OrdersStatusIcon" };
  }else{
    var MENU_WEEKLY : any = {};
  }

  if(permission == "super_admin" || permission == "admin" || permission == "billing" || permission == "logistics"){
    var MENU_COUPONS : any = { href: ROUTES.COUPONS, label: "Vouchers", icon: "CouponsIcon" };
  }else{
    var MENU_COUPONS : any = {};
  }

  if(permission == "super_admin" || permission == "admin" || permission == "billing"){
    var MENU_CLIENTS : any = { href: ROUTES.CUSTOMERS, label: "Utilizadores", icon: "UsersIcon" };
  }else{ 
    var MENU_CLIENTS : any = {}; 
  }
  if(permission == "super_admin" || permission == "admin" || permission == "billing"){
    var MENU_INVOICES : any = { href: ROUTES.INVOICES, label: "Financeiro", icon: "TaxesIcon" };
    var MENU_COURIERS : any = { href: ROUTES.COURIERS, label: "Estafetas", icon: "ShippingsIcon" };
  }else{
    var MENU_INVOICES : any = {};
    var MENU_COURIERS : any = {};
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
      MENU_COURIERS,
      MENU_COUPONS,
      MENU_INVOICES,
      MENU_SETTINGS,
      //{ href: ROUTES.SETTINGS, label: "Ajuda", icon: "HelpIcon" },
    ],
  };


  return (
    <aside style={{overflowX:"scroll"}} className="shadow w-72 xl:w-76 hidden lg:block overflow-y-auto bg-white px-4 fixed left-0 bottom-0 h-full pt-20">
      <SidebarMenu items={siteSettings.sidebarLinks} />
    </aside>
  );
};

export default Sidebar;
