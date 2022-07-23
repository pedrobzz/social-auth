import React, { useContext, useState } from "react";
import { Title } from "../application/common/components/Title";
import AppContext from "../application/common/context/appContext";
import { useTRCP } from "../application/common/hooks/useTRCP";

const Home = (): JSX.Element => {
  const [name, setName] = useState("");
  const ctx = useContext(AppContext);
  const trpc = useTRCP();
  const hello = trpc.useQuery(["user.hello", name]);
  return (
    <>
      <Title>My page</Title>
      <h3>Context Name: {ctx.name}</h3>
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
