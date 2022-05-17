import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import cn from "classnames";
import { ExpandLessIcon } from "@components/icons/expand-less-icon";
import { ExpandMoreIcon } from "@components/icons/expand-more-icon";
import { getIcon } from "@utils/get-icon";
import * as CategoryIcons from "@components/icons/category";
import { useUI } from "@contexts/ui.context";
import { useEffect, useState } from "react";

function SidebarMenuItem({ className, item, depth = 0 }: any) {
  const router = useRouter();
  const active = router?.query?.category;
  const isActive =
    active === item.slug ||
    item?.children?.some((_item: any) => _item.slug === active);
  const [isOpen, setOpen] = useState<boolean>(isActive);
  useEffect(() => {
    setOpen(isActive);
  }, [isActive]);
  const { slug, name, children: items, icon } = item;
  const { displaySidebar, closeSidebar } = useUI();

  function toggleCollapse() {
    setOpen((prevValue) => !prevValue);
  }
  function onClick() {
    if (Array.isArray(items) && !!items.length) {
      toggleCollapse();
    } else {
      // router.push(href);
      const { query } = router;
      const { type, ...rest } = query;
      router.push(
        {
          pathname: '/',
          query: { ...rest, category: slug },
        },
        {
          pathname: '/',
          query: { ...rest, category: slug },
        },
        {
          scroll: false,
        }
      );
      displaySidebar && closeSidebar();
    }
  }

  
  let expandIcon;
  if (Array.isArray(items) && items.length) {
    expandIcon = !isOpen ? (
      <ExpandLessIcon className="" />
    ) : (
      <ExpandMoreIcon className="" />
    );
  }

  return (
    <>
     
    <div className="inline-block" style={{padding:"10px 4px"}}>
          <a href={`#${slug}`} 
          className={cn(
            "px-4 py-2 text-sm  first-word border-gray-100 bg-white rounded-full text-heading  dark:border-neutral-300 uppercase ",
            isOpen ? "dark:text-white    dark:bg-primary" : "dark:text-white    dark:bg-primary",
            className ? className : "text-sm"
          )}
          >{name?.replace(/ .*/,'')}</a>
          </div>

    </>
  );
}

function SidebarMenu({ items, className }: any) {
  return (
    <>
      {items?.map((item: any) => (
        <SidebarMenuItem key={`${item.name}${item.slug}`} item={item} />
      ))}
    </>
  );
}

export default SidebarMenu;
