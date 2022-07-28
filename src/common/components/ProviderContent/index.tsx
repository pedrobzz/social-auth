import React from "react";
import { ClientSafeProvider, signIn } from "next-auth/react";
import GithubIcon from "../../icons/GithubIcon";
import GoogleIcon from "../../icons/GoogleIcon";

const ProviderContainer = ({
  provider,
  gradientDirection,
}: {
  provider: ClientSafeProvider;
  gradientDirection?: "lr" | "rl";
}): JSX.Element => {
  const icons = {
    GitHub: <GithubIcon />,
    Google: <GoogleIcon />,
  };
  const gradients = {
    lr: "from-blue-400 to-emerald-400 hover:from-emerald-400 hover:to-blue-400",
    rl: "to-blue-400 from-emerald-400 hover:to-emerald-400 hover:from-blue-400",
  };
  return (
    <div
      key={provider.name}
      className={`p-[2px] rounded-xl bg-gradient-to-r  transition-all ${
        gradients[gradientDirection || "lr"]
      }`}
    >
      <button
        className="flex rounded-xl justify-between items-center w-full px-6 py-2 bg-zinc-800 hover:bg-zinc-700 transition-all cursor-pointer"
        onClick={() => signIn(provider.id, { callbackUrl: "/" })}
      >
        {icons[provider.name]}
        <h4 className="md:text-lg font-thin">Sign In with {provider.name}</h4>
      </button>
    </div>
  );
};

export default ProviderContainer;
