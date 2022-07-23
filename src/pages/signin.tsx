/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { getProviders, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";

export default function SignIn({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
}): JSX.Element {
  return (
    <>
      {providers &&
        Object.values(providers).map(provider => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
