import React, { useContext, useState } from "react";
import AppContext from "../common/context/appContext";
import { useTRPC } from "../common/hooks/useTRPC";
import { useSession, signIn, signOut } from "next-auth/react";

const Home = (): JSX.Element => {
  const [name, setName] = useState("");
  const ctx = useContext(AppContext);
  const trpc = useTRPC();
  const hello = trpc.useQuery(["user.hello", name]);
  const { data: session } = useSession();
  return (
    <>
      <h3 className="text-red-400">Context Name: {ctx.name}</h3>
      <h3>
        Hello, My name is:{" "}
        <input
          placeholder="World"
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
        />
      </h3>
      {name && hello.data && <h2>{hello.data.greeting}</h2>}
      {session && session.user ? (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
    </>
  );
};

export default Home;
