/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import { createPortal } from "react-dom";

/* import { Container } from "./styles"; */

const BackDrop = ({
  handleClick,
}: {
  handleClick: () => void;
}): JSX.Element => {
  return (
    <div
      className="absolute w-full h-full bg-zinc-900 opacity-50"
      onClick={handleClick}
    />
  );
};

const Modal = ({
  handleClose,
  clickBackdrop,
  hideCloseIcon,
  children,
}: {
  handleClose: () => void;
  clickBackdrop?: () => void;
  hideCloseIcon?: boolean;
  children: JSX.Element;
}): JSX.Element => {
  return createPortal(
    <div className="absolute h-screen w-screen flex flex-col justify-center items-center z-10">
      <div
        className={`z-20 bg-zinc-700 rounded-md px-5 ${
          hideCloseIcon ? "py-5" : "py-2"
        } w-full fixed bottom-0 min-h-[40vh] sm:relative sm:w-[60vw] sm:max-w-2xl`}
      >
        <div className="flex flex-row-reverse">
          {!hideCloseIcon && (
            <button
              className=" text-white font-bold py-2 px-4 rounded-md"
              onClick={handleClose}
            >
              X
            </button>
          )}
        </div>
        {children}
      </div>
      <BackDrop handleClick={clickBackdrop || handleClose} />
    </div>,
    document.querySelector("#modal") as Element,
  );
};

export default Modal;
