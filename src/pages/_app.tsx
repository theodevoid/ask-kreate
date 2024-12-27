import { GeistSans } from "geist/font/sans";
import { AppProps, type AppType } from "next/app";

import { api } from "~/utils/api";

import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { useAuth } from "~/hooks/useAuth";
import "~/styles/globals.css";
import { Toaster } from "~/components/ui/sonner";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  useAuth();

  return getLayout(
    <>
      <style
        jsx
        global
      >{`:root { --font-geist-sans: ${GeistSans.style.fontFamily};}}`}</style>
      <div className={GeistSans.className}>
        <Component {...pageProps} />
        <Toaster />
      </div>
    </>,
  );
};

export default api.withTRPC(MyApp);
