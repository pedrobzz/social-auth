/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from "react";

import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import Modal from "../common/components/Modal";
import { Input } from "../common/components/form";
import { useTRPC } from "../common/hooks";
import toast from "react-hot-toast";

const useModal = (): { isOpen; openModal; closeModal } => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return { isOpen, closeModal, openModal };
};

const Profile = (): JSX.Element => {
  const { data: session, status } = useSession();
  const { isOpen, closeModal, openModal } = useModal();
  const [formLoading, setFormLoading] = useState(false);
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
        <h1>Profile</h1>
        <h3>{session.user.name}</h3>
        <h3>{session.user.email}</h3>
        <h3>{session.user.username}</h3>
        {isOpen && (
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
                onSubmit={async e => {
                  e.preventDefault();
                  setFormLoading(true);
                  const response = await changeUsernameMutation.mutateAsync({
                    id: session.user.id,
                    username,
                  });
                  setFormLoading(false);
                  if (response.status === 200) {
                    session.user.username = username;
                    console.log(session);
                    closeModal();
                  } else {
                    toast.error(response.message!);
                  }
                }}
              >
                <Input
                  name="username"
                  required
                  className="w-full"
                  inputProps={{ autoComplete: "off" }}
                  onChange={e => setUsername(e.target.value)}
                />
                <button
                  className={`relative px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 w-full disabled:opacity-25 disabled:cursor-not-allowed`}
                  disabled={formLoading}
                >
                  <svg
                    className={`absolute ${
                      formLoading
                        ? "animate-spin block ml-[-10px] xs:ml-0"
                        : "hidden"
                    }  top-0 bottom-0 mt-auto mb-auto h-5 w-5 text-white`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Save Username
                </button>
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
  return { props: {} };
};
