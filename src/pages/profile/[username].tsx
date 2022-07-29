/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { GetServerSideProps } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import Image from "next/image";
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
    image: string;
  };
}): JSX.Element => {
  if (!user) {
    return <h1>404</h1>;
  }
  const { user: currentUser } = session;
  const isAdmin = currentUser?.username === user.username;
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="max-h-[20%] overflow-hidden">
        <Image
          src="https://blog.123milhas.com/wp-content/uploads/2021/11/banner-28.jpg"
          height={200}
          width={400}
          layout="responsive"
          objectFit="cover"
          objectPosition="bottom"
        />
      </div>
      <div id="user-container" className="p-2">
        <div>
          <div className="flex justify-between">
            <div className="w-1/4 h-1/4 rounded-full border-2  border-slate-800 overflow-hidden mt-[-15%] z-20 bg-slate-800">
              <Image
                src={user.image}
                height={200}
                width={200}
                layout="responsive"
                objectFit="cover"
                objectPosition="bottom"
              />
            </div>
            {isAdmin && (
              <button className="px-4 py-2 text-sm font-bold rounded-3xl border border-slate-500 h-fit">
                Edit Profile
              </button>
            )}
          </div>
          <h1>{user.name}</h1>
          <h4 className="text-gray-400">@{user.username}</h4>
        </div>
      </div>
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
  return {
    props: {
      session,
      user: userData || null,
    },
  };
};
