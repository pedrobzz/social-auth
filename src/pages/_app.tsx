/* eslint-disable @typescript-eslint/no-unused-vars */
import { withTRPC } from "@trpc/next";
import type { AppProps } from "next/app";
import React from "react";

import { AppContextProvider } from "../application/common/context/appContext";
import { AppRouter } from "./api/trpc/[trpc]";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  // https://stackoverflow.com/questions/71809903/next-js-component-cannot-be-used-as-a-jsx-component
  const TypedComponent = Component as unknown as React.FC;
  return (
    <AppContextProvider>
      <TypedComponent {...pageProps} />
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
