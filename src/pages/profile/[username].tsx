/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { GetServerSideProps } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import React from "react";
import { makeUserRepository } from "../../server/application/factories/makeUserRepository";
import { authOptions } from "../api/auth/[...nextauth]";

/* import { Container } from "./styles"; */

const profile = ({
  session,
  user,
}: {
  session: Session;
  user?: {
    id: string;
    name: string;
    email: string;
    username: string | null;
  };
}): JSX.Element => {
  if (!user) {
    return <h1>404</h1>;
  }
  return (
    <div>
      <h1>{user.name}</h1>
      <h3>{user.username}</h3>
    </div>
  );
};

export default profile;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );
  const userRepository = makeUserRepository();
  const userResponse = await userRepository.getUserByUsername(
    context.query.username
      ? Array.isArray(context.query.username)
        ? context.query.username[0]
        : context.query.username
      : "",
  );
  const userData = userResponse.data;
  console.log(userData);
  return {
    props: {
      session,
      user: userData,
    },
  };
};
