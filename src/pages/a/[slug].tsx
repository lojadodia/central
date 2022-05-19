
import { useRouter } from "next/router";

import { scroller, Element } from "react-scroll";
import { QueryClient } from "react-query";

import dynamic from "next/dynamic";
import HomeLayout from "@components/layout/home-layout";
import ProductFeed from "@components/product/feed";
import { useWindowSize } from "@utils/use-window-size";
import { sitePages, PageName } from "@settings/site-pages.settings";
import { getKeyValue } from "@utils/get-key-value";
import { fetchProducts } from "@data/product/use-products.query";
import { fetchCategories } from "@data/category/use-categories.query";
import { fetchTypes } from "@data/type/use-types.query";
import { useUI } from "@contexts/ui.context";
import React, { useEffect } from "react";
import Scrollbar from "@components/ui/scrollbar";
import BakeryCategory from "@components/category/bakery-category";

const CartCounterButton = dynamic(
  () => import("@components/cart/cart-counter-button"),
  { ssr: false }
);

const CartSidebarView = dynamic(
	() => import('@components/cart/cart-sidebar-view')
);

export default function HomePage() {

  const { displayModal, openModal, setModalView, setModalData } = useUI();
  const { query } = useRouter();
  const queryClient = new QueryClient();

  queryClient.prefetchInfiniteQuery(
    ["products", { type: 'home' }],
    fetchProducts,
    {
      staleTime: 10 * 1000,
    }
  );
  queryClient.prefetchQuery(
    ["categories", { type: 'home' }],
    fetchCategories,
    {
      staleTime: 10 * 1000,
    }
  );
  queryClient.prefetchQuery("types", fetchTypes, {
    staleTime: 10 * 1000,
  });

  useEffect(() => {
    if (!displayModal) {
      

      setModalData(query.slug);
      setModalView("PRODUCT_DETAILS");
      return openModal();
    }
  }, [])
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
    
    <Element
        name="grid"
        className="flex flex-1 border-t border-r border-solid border-theme dark:border-neutral-700 dark:bg-black border-opacity-70"
      >
       
        <main className="flex-1">
        <div className="grid grid-cols-3 gap-0">
          
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
          <div className="relative">

              <CartSidebarView />

            </div>
          </div>

        </main>
      </Element>
  );
}

HomePage.Layout = HomeLayout;
