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
import Toggle from 'react-toggle';
import { API_ENDPOINTS } from "@utils/api/endpoints";
import Color from "color";
import http from '@utils/api/http'
import settings from "@repositories/settings";
import { useSettings } from "@contexts/settings.context";
import { toast } from "react-toastify";
import { RiShoppingBagFill, RiMotorbikeFill } from "react-icons/ri";

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
        href: ROUTES.ORDERS,
        label: "PEDIDOS",
        icon: "DashboardIcon",
      },


    ],
  }; 
  const settings = useSettings();

  let delivery = true;
  if(settings?.order?.type?.delivery == "true"){
    delivery = true;
  }else if(settings?.order?.type?.delivery == "false"){
    delivery = false;
  }

  let takeaway = true;
  if(settings?.order?.type?.takeaway == "true"){
    takeaway = true;
  }else if(settings?.order?.type?.takeaway == "false"){
    takeaway = false;
  }
  const { closeModal, setModalView, openModal} = useUI();

  async function handleMenu() {
    closeModal();
    setModalView('MENU');
    return openModal();
  }


  return (
    <header className="bg-dark-primary  border-b  border-dark-primary shadow fixed w-full z-40">
      <nav className="px-5 md:px-8 py-2 flex items-center justify-between">
        {/* <!-- Mobile menu button --> */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleMenu}
          className="flex p-2 h-full items-center justify-center  "
        >
          <NavbarIcon />
        </motion.button>

        <div className="hidden md:flex ml-5 mr-auto">
        <Logo className="hidden" />
        </div>

        <Drawer open={displaySidebar} onClose={closeSidebar} variant="left">
          <DrawerWrapper onClose={closeSidebar}>
            <SidebarMenu
              items={siteSettings?.sidebarLinks}
              className="px-5 py-3"
            />
          </DrawerWrapper>
        </Drawer>

        <div className="flex items-center space-x-4">

        <RiShoppingBagFill className="inline-block text-xl" style={{marginTop:"-3px"}}/>   <Toggle
              id='takeaway'
              defaultChecked={takeaway}
              onChange={() => {
                http.post(API_ENDPOINTS.STORE_STATUS, {
                  key: '4cee5c6343776604b7fe209b28t',
                  type: 'takeaway',
                  takeaway: !takeaway
                }).then(({ data }) => {
                  takeaway = data
                  if(data == true){
                    //toast.info("Recolha Habilitada");
                  }else{
                    //toast.info("Recolha Desabilitada");
                  }
                })
              }}
          />

        &nbsp;
        <RiMotorbikeFill className="inline-block text-xl" style={{marginTop:"-3px"}}/> <Toggle
              id='delivery'
              defaultChecked={delivery}
              onChange={() => {
                http.post(API_ENDPOINTS.STORE_STATUS, {
                  key: '4cee5c6343776604b7fe209b28t',
                  type: 'delivery',
                  delivery: !delivery
                }).then(({ data }) => {
                  delivery = data
                  if(data == true){
                    //toast.info("Entrega Habilitada");
                  }else{
                    //toast.info("Entrega Desabilitada");
                  }
                })
              }}
          />
        
      
      
          <AuthorizedMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
