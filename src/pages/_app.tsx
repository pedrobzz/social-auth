/* eslint-disable @typescript-eslint/no-unused-vars */
import "../common/styles/globals.css";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { withTRPC } from "@trpc/next";
import type { AppProps } from "next/app";
import { AppContextProvider } from "../common/context/appContext";

import { AppRouter } from "./api/trpc/[trpc]";
import { Toaster } from "react-hot-toast";
const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  // https://stackoverflow.com/questions/71809903/next-js-component-cannot-be-used-as-a-jsx-component
  const TypedComponent = Component as unknown as React.FC;
  return (
    <AppContextProvider>
      <SessionProvider session={pageProps.session}>
        <TypedComponent {...pageProps} />
        <Toaster />
      </SessionProvider>
    </AppContextProvider>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(App);
