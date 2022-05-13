import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import cn from "classnames";
import { ExpandLessIcon } from "@components/icons/expand-less-icon";
import { ExpandMoreIcon } from "@components/icons/expand-more-icon";
import { getIcon } from "@utils/get-icon";
import * as sidebarIcons from "@components/icons/sidebar";
import { useUI } from "@contexts/ui.context";
function SidebarMenuItem({ className, item, depth = 0 }: any) {
  const router = useRouter();
  const [isOpen, setOpen] = useState(() => router.pathname === item.href);
  const { href, label, items, icon } = item;
  const { displaySidebar, closeSidebar } = useUI();
  function toggleCollapse() {
    setOpen((prevValue) => !prevValue);
  }

  function onClick() {
    if (Array.isArray(items)) {
      toggleCollapse();
    } else {
      router.push(href);
      displaySidebar && closeSidebar();
    }
  }

  let expandIcon;
  if (Array.isArray(items) && items.length) {
    expandIcon = !isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />;
  }

  return (
    <>
   {icon && (
      <motion.li
        initial={false}
        animate={{ backgroundColor: "#111" }}
        onClick={onClick}
        className="py-3 rounded-md"
      > 
        <button
          className={cn(
            "flex w-full items-center text-left outline-none border-0 focus:outline-none focus:ring-0 focus:text-primary",
            router.pathname === href ? "text-white" : "text-heading dark:text-white",
            isOpen ? "text-primary" : "text-gray-600 dark:text-neutral",
            className ? className : "text-base"
          )}
        >
          {getIcon({
            iconList: sidebarIcons,
            iconName: icon,
            className: "w-5 h-5 mr-4",
          })}
          <p className="flex-1">{label}</p>
          <span>{expandIcon}</span>
        </button>
      </motion.li>
      )}
      <AnimatePresence initial={false}>
        {Array.isArray(items) && isOpen ? (
          <li>
            <motion.ul
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="ml-4 text-xs"
            >
              {items?.map((currentItem) => {
                const childDepth = depth + 1;
                return (
                  <SidebarMenuItem
                    key={`${currentItem.href}${currentItem.label}`}
                    item={currentItem}
                    depth={childDepth}
                    className={cn("text-sm text-gray-500")}
                  />
                );
              })}
            </motion.ul>
          </li>
        ) : null}
      </AnimatePresence>
    </>
    
  );
}

function SidebarMenu({ items, className }: any) {
  return (
    <ul className={cn("text-xs", className)}>
      {items?.map((item: any) => (
        <SidebarMenuItem key={`${item.href}${item.label}`} item={item} />
      ))}
    </ul>
  );
}

export default SidebarMenu;
