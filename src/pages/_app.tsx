import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useAuth } from "~/hooks/useAuth";

const MyApp: AppType = ({ Component, pageProps }) => {
  useAuth();

  return (
    <div className={GeistSans.className}>
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
