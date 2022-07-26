/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useReducer } from "react";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";
import GithubIcon from "../common/icons/GithubIcon";
import GoogleIcon from "../common/icons/GoogleIcon";
import { Input } from "../common/components/form";
import Link from "next/link";
import { useTRPC } from "../common/hooks";
import toast from "react-hot-toast";
import ProviderContainer from "../common/components/ProviderContent";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function SignIn({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
}): JSX.Element {
  const [signInForm, dispatch] = useReducer(
    (
      state: { email: string; password: string; name: string },
      action: {
        type: "updateName" | "updateEmail" | "updatePassword";
        payload: string;
      },
    ) => {
      switch (action.type) {
        case "updateEmail":
          return { ...state, email: action.payload };
        case "updatePassword":
          return { ...state, password: action.payload };
        case "updateName":
          return { ...state, name: action.payload };
        default:
          return state;
      }
    },
    {
      email: "",
      password: "",
      name: "",
    },
  );
  const trpc = useTRPC();
  const registerUserMutation = trpc.useMutation("user.registerUser");
  return (
    <div className="w-screen h-screen bg-zinc-800 flex flex-col justify-center items-center overflow-hidden">
      <div className="max-w-sm text-center flex flex-col gap-3">
        <h1>Create an Account</h1>
        <h4 className="text-slate-300 text-center">
          Create an Account using your favorite Sign Up Method.{" "}
          <span>
            <Link href="/signin">Already has an Account?</Link>
          </span>
        </h4>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between max-w-4xl w-full md:w-[90%] items-center">
        <div className="mt-4 w-[80%] md:w-[45%]">
          <form
            onSubmit={async e => {
              e.preventDefault();
              const response = await registerUserMutation.mutateAsync(
                signInForm,
              );
              if (response.status !== 200) {
                toast.error(response.message || "Oops! Something went wrong");
                return;
              }
              toast.success("Successfully registered");
              signIn("credentials", {
                email: signInForm.email,
                password: signInForm.password,
                callbackUrl: "/",
              });
            }}
          >
            <Input
              name="Your Name"
              required
              onChange={e =>
                dispatch({ type: "updateName", payload: e.target.value })
              }
            />
            <Input
              name="Email"
              required
              type="email"
              onChange={e =>
                dispatch({ type: "updateEmail", payload: e.target.value })
              }
            />
            <Input
              name="Password"
              required
              type="password"
              onChange={e =>
                dispatch({ type: "updatePassword", payload: e.target.value })
              }
            />
            <div className="flex items-baseline justify-between">
              <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 w-full">
                Create an Account
              </button>
            </div>
          </form>
        </div>
        <h1 className="hidden md:block">/</h1>
        <h2 className="block md:hidden my-2">or</h2>
        <div className="flex flex-col gap-4 w-[80%] md:w-[45%]">
          {providers &&
            Object.values(providers)
              .filter(p => p.type !== "credentials")
              .map((provider, i) => (
                <ProviderContainer
                  key={provider.name}
                  provider={provider}
                  gradientDirection={i % 2 === 0 ? "lr" : "rl"}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );
  if (session) {
    context.res.statusCode = 302;
    context.res.setHeader("Location", "/");
    return { props: {} };
  }
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

// SSG
