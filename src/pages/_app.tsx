import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Familjen_Grotesk } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Header } from "~/components/layout/Header";

const grotesk = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <style
          jsx
          global
        >{`:root { --font-grotesk: ${grotesk.style.fontFamily};}}`}</style>
        <main className={`font-sans ${grotesk.variable}`}>
          <Header />
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
