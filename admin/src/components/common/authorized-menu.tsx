import { useState } from "react";
import { useLayer } from "react-laag";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "./avatar";
import Link from "next/link";
import { siteSettings } from "@settings/site.settings";
import { useSettings } from "@contexts/settings.context";
import { useMeQuery } from "@data/user/use-me.query";
import { ROUTES } from "@utils/routes";

export default function AuthorizedMenu() {
  const [isOpen, setOpen] = useState(false);
  const { data } = useMeQuery();

  // helper function to close the menu
  function close() {
    setOpen(false);
  }

  const { renderLayer, triggerProps, layerProps } = useLayer({
    isOpen,
    onOutsideClick: close, // close the menu when the user clicks outside
    onDisappear: close, // close the menu when the menu gets scrolled out of sight
    overflowContainer: false, // keep the menu positioned inside the container
    // auto: true, // automatically find the best placement
    placement: "bottom-end", // we prefer to place the menu "top-end"
    triggerOffset: 12, // keep some distance to the trigger
    containerOffset: 16, // give the menu some room to breath relative to the container
    arrowOffset: 16, // let the arrow have some room to breath also
  });


  const permission = data?.permission;
  
  const settings = useSettings();

  if(permission == "super_admin" || permission == "admin"){
    var MENU_BANNERS : any = { href: ROUTES.BANNERS, label: "Banners" };
  }else{
    var MENU_BANNERS : any = {};
  }
  if(permission == "super_admin" || permission == "admin" || permission == "support"){
    var MENU_FAQ : any =  { href: ROUTES.FAQS, label: "Dúvidas (FAQs)" };
  }else{
    var MENU_FAQ : any = {};
  }
  if(permission == "super_admin" || permission == "admin" || permission == "billing"){
    var MENU_TAXES : any =  { href: ROUTES.TAXES, label: "Conf. Impostos" };
    var MENU_SHIPPING : any =  { href: settings?.env?.SHIPPING_REGION == "area" ? ROUTES.SHIPPINGS_AREA : ROUTES.SHIPPINGS, label: "Conf. Entrega" };
  }else{
    var MENU_TAXES : any = {};
    var MENU_SHIPPING : any = {};
  }

  if(permission == "super_admin"){
    var MENU_SETTINGS : any = { href: ROUTES.SETTINGS, label: "Definições" };
    var MENU_CATEGORIES_POSITION : any =  { href: ROUTES.CATEGORIES_POSITION, label: "Ordem Categorias" };
    var MENU_ORDER_STATUS : any =  { href: ROUTES.ORDER_STATUS, label: "Conf. Processos" };
  }else{
    var MENU_SETTINGS : any = {};
    var MENU_ORDER_STATUS : any = {};
    var MENU_CATEGORIES_POSITION : any = {};
  }



  const site = {
    authorizedLinks: [
      MENU_SETTINGS,
      { href: ROUTES.PROFILE_UPDATE, label: "Perfil" },
      MENU_FAQ,
      MENU_BANNERS,
      MENU_CATEGORIES_POSITION,
      MENU_ORDER_STATUS,
      MENU_SHIPPING,
      MENU_TAXES,
      { href: ROUTES.LOGOUT, label: "Sair" },
    ]
  };



  // Again, we're using framer-motion for the transition effect
  return (
    <>
      <button
        type="button"
        className="flex items-center focus:outline-none"
        aria-label="toggle profile dropdown"
        onClick={() => setOpen(!isOpen)}
        {...triggerProps}
      >
        <Avatar
          src={
            data?.profile?.avatar?.thumbnail ??
            siteSettings?.avatar?.placeholder
          }
          alt="avatar"
        />
      </button>
      {renderLayer(
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              {...layerProps}
              initial={{ opacity: 0, scale: 0.85 }} // animate from
              animate={{ opacity: 1, scale: 1 }} // animate to
              exit={{ opacity: 0, scale: 0.85 }} // animate exit
              transition={{
                type: "spring",
                stiffness: 800,
                damping: 35,
              }}
              className="py-2 w-48 bg-white rounded shadow-base z-50"
            >
              {site.authorizedLinks.map(({ href, label }) => (

                
                <li
                  key={`${href}${label}`}
                  className="border-b border-gray-100 cursor-pointer last:border-0"
                >
                  {href && (
                  <Link href={href}>
                    <a className="block px-4 py-3 text-sm text-heading font-medium transition duration-200 hover:text-primary  ">
                      {label}
                    </a>
                  </Link>
                  )}
                </li>
               

                
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
