import { useRouter } from "next/router";

import { scroller, Element } from "react-scroll";
import dynamic from "next/dynamic";
import HomeLayout from "@components/layout/home-layout";
import ProductFeed from "@components/product/feed";
import BakeryCategory from "@components/category/bakery-category";
import { useWindowSize } from "@utils/use-window-size";
import { sitePages, PageName } from "@settings/site-pages.settings";
import { getKeyValue } from "@utils/get-key-value";
import React, { useEffect } from "react";
import { fetchSettings } from "@data/settings/use-settings.query";
import { GetServerSideProps } from "next";
import Scrollbar from "@components/ui/scrollbar";
import { RiRefreshLine } from 'react-icons/ri';
const CartSidebarView = dynamic(
	() => import('@components/cart/cart-sidebar-view')
);


const CartCounterButton = dynamic(
  () => import("@components/cart/cart-counter-button"),
  { ssr: false }
);





export default function HomePage() {

  

    
  const { query } = useRouter();
  // !query.category && (query.category = 'fruits')
  useEffect(() => {
    if (query.text || query.category) {
      scroller.scrollTo("grid", {
        smooth: true,
        offset: -110,
      });
    }
  }, [query.text, query.category]);


  

  const { width } = useWindowSize();
  const PAGE_TYPE = "home";
  const getPageData = getKeyValue(sitePages, PAGE_TYPE as PageName);


  return (
    
    <>

      <Element
        name="grid"
        className="flex flex-1 border-t border-r border-solid border-theme dark:border-neutral-700 dark:bg-black border-opacity-70"
      >
       
        <main className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
          
              <div className="col-span-2">
                <div className="w-full dark:bg-neutral-900 py-3 px-0 lg:px-5 border-b dark:border-neutral-700 lg:mt-20 mt-5">
                   <BakeryCategory /> 
                </div> 
             
              <Scrollbar
                className="w-full"
                style={{ height: "calc(100vh - 147px)",marginBottom:"-97px" }}>
                
              <ProductFeed />
            </Scrollbar>
         
          </div>
          <div className="relative hidden md:block">

              <CartSidebarView />

            </div>
          </div>

        </main>
      </Element>
      <div style={{position:"fixed",bottom:"30px",left:"30px"}}>
        <a href="" className="rounded-full bg-primary text-white text-xl py-4 px-3" style={{boxShadow:"0px 0px 25px rbga(0,0,0,.3)"}}><RiRefreshLine className="fill-current h-8 w-8 text-teal-500 " style={{ display: "inline-block", verticalAlign: '-7.5px' }} /></a>
      </div>
     {width > 1023 && <CartCounterButton />} 
    </>
  );
}

HomePage.Layout = HomeLayout;
