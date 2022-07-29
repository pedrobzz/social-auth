/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from "react";

import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import Modal from "../../common/components/Modal";
import { Input } from "../../common/components/form";
import { useTRPC, useZodValidator } from "../../common/hooks";
import { z } from "zod";
import SubmitButton from "../../common/components/form/SubmitButton";
import { useRouter } from "next/router";
import Link from "next/link";

const useModal = (): { isOpen; openModal; closeModal } => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return { isOpen, closeModal, openModal };
};

const Profile = (): JSX.Element => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isOpen, closeModal, openModal } = useModal();
  const [formLoading, setFormLoading] = useState(false);
  const { validate, errors, resetError, setErrors } =
    useZodValidator<"username">({
      username: z
        .string()
        .min(3)
        .max(20)
        .refine(
          value =>
            !value ||
            (/^[a-zA-Z0-9_]+$/.test(value) &&
              /^[a-zA-Z]/.test(value.charAt(0))),
          {
            message:
              "Username should start with a letter and only contain letters, numbers, and underscores",
          },
        )
        .innerType(),
    });
  const [username, setUsername] = useState("");
  const trpc = useTRPC();
  const changeUsernameMutation = trpc.useMutation("user.updateUsername");
  useEffect(() => {
    if (session?.user && !session.user.username) {
      openModal();
    }
  }, [session?.user]);
  if (status === "loading" || !session?.user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-screen h-screen bg-zinc-800 flex flex-col justify-center items-center">
      <div>
        {session.user.username && (
          <Link href={`/profile/${session.user.username}`}>
            Go to your profile
          </Link>
        )}
        {isOpen && !session.user.username && (
          <Modal
            handleClose={() => {
              return;
            }}
            hideCloseIcon
          >
            <div className="flex items-center flex-col">
              <h1>Choose an Username</h1>
              <h3 className="text-center">
                At this time, you have no username. To finish registration, you
                need to add one.
              </h3>
              <hr className="w-full h-2 my-2 opacity-25" />
              <form
                className="w-[80%]"
                noValidate
                onSubmit={async e => {
                  e.preventDefault();
                  setFormLoading(true);
                  const validation = await validate({ username });
                  if (Object.keys(validation).length > 0) {
                    setFormLoading(false);
                    return;
                  }
                  const response = await changeUsernameMutation.mutateAsync({
                    id: session.user.id,
                    username,
                  });
                  setFormLoading(false);
                  if (response.status === 200) {
                    session.user.username = username;
                    closeModal();
                    return router.push(`/profile/${username}`);
                  } else {
                    setErrors({ username: [response.message!] });
                  }
                }}
              >
                <Input
                  name="username"
                  required
                  className="w-full"
                  inputProps={{ autoComplete: "off" }}
                  onChange={e => setUsername(e.target.value)}
                  error={errors.username?.join(". ")}
                  onBlur={async e =>
                    e.target.value
                      ? await validate({ username: e.target.value })
                      : resetError("username")
                  }
                />
                <SubmitButton loading={formLoading}>Save Username</SubmitButton>
              </form>
            </div>
          </Modal>
        )}
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
  if (session.user.username) {
    context.res.statusCode = 302;
    context.res.setHeader("Location", `/profile/${session.user.username}`);
    return { props: {} };
  }
  return { props: {} };
};
