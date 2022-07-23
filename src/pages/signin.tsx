/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";
import GithubIcon from "../common/icons/GithubIcon";

const ProviderContainer = ({
  provider,
}: {
  provider: ClientSafeProvider;
}): JSX.Element => {
  const icons = {
    GitHub: <GithubIcon />,
  };
  return (
    <div
      key={provider.name}
      className="p-[2px] rounded-xl bg-gradient-to-r from-blue-400 to-emerald-400 hover:from-emerald-400 hover:to-blue-400 transition-all"
    >
      <button
        className="flex rounded-xl justify-between items-center w-full px-4 py-2 gap-10 bg-zinc-800 hover:bg-zinc-700 transition-all cursor-pointer"
        onClick={() => signIn(provider.id, { callbackUrl: "/" })}
      >
        {icons[provider.name]}
        <h3>Sign In with {provider.name}</h3>
      </button>
    </div>
  );
};

export default function SignIn({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
}): JSX.Element {
  return (
    <div className="w-screen h-screen bg-zinc-800 flex flex-col justify-center items-center">
      <div className="max-w-sm text-center flex flex-col gap-3">
        <h1>Login to your Account</h1>
        <h4 className="text-slate-300 text-center">
          Access your account using your favorite Login Method
        </h4>
      </div>
      <div>
        {providers &&
          Object.values(providers).map(provider => (
            <ProviderContainer key={provider.name} provider={provider} />
          ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
