import type { AppProps /*, AppContext */ } from "next/app";
import Head from "next/head";
import Router from "next/router";

import "@vetixy/circular-std";
import "@fontsource/open-sans";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "@assets/main.css";
import "react-toastify/dist/ReactToastify.css";
import { UIProvider } from "@contexts/ui.context";
import { SearchProvider } from "@contexts/search.context";
import { CheckoutProvider } from "@contexts/checkout.context";
import ModalContainer from "@components/common/modal/modal-container";
import SidebarContainer from "@components/common/sidebar/sidebar-container";
import ErrorMessage from "@components/ui/error-message";
import { SettingsProvider } from "@contexts/settings.context";
import PageLoader from "@components/ui/page-loader/page-loader";
import {
  useSettingsQuery,
  fetchSettings,
} from "@data/settings/use-settings.query";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { ReactQueryDevtools } from "react-query/devtools";
import { useEffect, useRef, useState } from "react";
import Color from "color";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "@contexts/quick-cart/cart.context";
import Seo from "@components/ui/seo";
import { useSettings } from "@contexts/settings.context";
import TagManager from "react-gtm-module";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const Noop: React.FC = ({ children }) => <>{children}</>;

const AppSettings: React.FC = (props) => {
  const { data, error, isLoading: loading } = useSettingsQuery();

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error.message} />;
  return <SettingsProvider initialValue={data?.settings?.options} {...props} />;
};

export default function CustomApp({ Component, pageProps }: AppProps) {
  const queryClientRef = useRef<any>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  
 


  useEffect(() => {
    // alterar o tema do site.
    i18next
      .use(HttpApi)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        supportedLngs: ["PT", "BR"],
        fallbackLng: "PT",
        debug: false,
        // Options for language detector
        detection: {
          order: ["path", "cookie", "htmlTag"],
          caches: ["cookie"],
        },
        // react: { useSuspense: false },
        backend: {
          loadPath: "/locales/{{lng}}/translation.json",
        },
      });


  setTimeout(() => {

      if(Router?.query?.token){
        const hash = new Buffer(Router?.query?.token, 'base64')
        const base64 = hash.toString();
        const get = base64.split("\\");
    
        if (typeof get[0] !== 'undefined' && typeof get[1] !== 'undefined') {

          Cookies.set("auth_token", get[0]);
          Cookies.set("auth_permissions", {"super_admin":"SUPER_ADMIN"});
          Cookies.set("url_endpoint", get[1]);
    

          window.location.href="https://central-v4.lojadodia.com/central";
        }
      }
      
  }, 1000);

  }, []);


  const Layout = (Component as any).Layout || Noop;
  return (

      <QueryClientProvider client={queryClientRef.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <AppSettings>
            <UIProvider>
              <CartProvider>
                <CheckoutProvider>
                  <SearchProvider>
                    <Layout>
                      <Head> 
                      </Head>
                      <Seo />

                      <Component {...pageProps} />
                    </Layout>
                    <ToastContainer autoClose={4000} />
                    <ModalContainer />
                    <SidebarContainer />
                  </SearchProvider>
                </CheckoutProvider>
              </CartProvider>
            </UIProvider>
          </AppSettings>
        </Hydrate>
        <ReactQueryDevtools />
      </QueryClientProvider>

 
  );
}
