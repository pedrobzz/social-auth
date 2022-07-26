import React, { useContext, useState } from "react";

import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useSession } from "next-auth/react";

const Profile = (): JSX.Element => {
  const { data: session, status } = useSession();
  if (status === "loading" || !session?.user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-screen h-screen bg-zinc-800 flex flex-col justify-center items-center">
      <div>
        <h1>Profile</h1>
        <h3>{session.user.name}</h3>
        <h3>{session.user.email}</h3>
      </div>
    </div>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );
  if (!session) {
    context.res.statusCode = 302;
    const redirectUrl = encodeURIComponent("/profile");
    context.res.setHeader("Location", `/signin?redirect=${redirectUrl}`);
    return { props: {} };
  }
  return { props: {} };
};
