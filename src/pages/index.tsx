import React, { useContext, useState } from "react";
import AppContext from "../common/context/appContext";
import { useTRCP } from "../common/hooks/useTRCP";

const Home = (): JSX.Element => {
  const [name, setName] = useState("");
  const ctx = useContext(AppContext);
  const trpc = useTRCP();
  const hello = trpc.useQuery(["user.hello", name]);
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
    </>
  );
};

export default Home;
