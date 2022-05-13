import type { AppProps /*, AppContext */ } from "next/app";
import Head from "next/head";
import "@vetixy/circular-std";
import "@fontsource/open-sans";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "react-toastify/dist/ReactToastify.css";
import "@assets/main.css";
import { UIProvider } from "@contexts/ui.context";
import { SettingsProvider } from "@contexts/settings.context";
import ErrorMessage from "@components/ui/error-message";
import PageLoader from "@components/ui/page-loader/page-loader";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { useSettingsQuery, fetchSettings } from "@data/settings/use-settings.query";
import Color from 'color'; 
import { ReactQueryDevtools } from "react-query/devtools";
import { useSettings } from "@contexts/settings.context";
import { useEffect, useRef } from "react";
import { ThemeProvider } from "next-themes";

const Noop: React.FC = ({ children }) => <>{children}</>;

const AppSettings: React.FC = (props) => {
  const { data, isLoading: loading, error } = useSettingsQuery();
  
  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error.message} />;

  const color = Color(data?.options?.site?.color).darken(0.5);
  

  
  document.documentElement.style.setProperty('--gossamer-500', data?.options?.site?.color);
  document.documentElement.style.setProperty('--gossamer-600', color);
  document.documentElement.style.setProperty('--bg-dark-primary', Color(data?.options?.site?.color).darken(0.7));
  document.documentElement.style.setProperty('--border-dark-primary', Color(data?.options?.site?.color).darken(0.5));

  var link = document.querySelector("link[rel~='icon']");
  if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = data?.options?.seo?.ogImage?.original;

  return <SettingsProvider initialValue={data?.options} {...props} />;
};

export default function CustomApp({ Component, pageProps }: AppProps) {
  const queryClientRef = useRef<any>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  const Layout = (Component as any).Layout || Noop;



  return (
    <ThemeProvider attribute="class" forcedTheme="dark">
      <QueryClientProvider client={queryClientRef.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <AppSettings>
            <UIProvider>
              <Layout>
                <Head>
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1 maximum-scale=1"
                  />
                  <title>Encomendas</title>
                </Head>
                <Component {...pageProps} />
                <ToastContainer autoClose={4000} />
              </Layout>
            </UIProvider>
          </AppSettings>
          <ReactQueryDevtools />
        </Hydrate>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
