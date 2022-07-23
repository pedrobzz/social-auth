/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { HTMLAttributes, SVGAttributes } from "react";

/* import { Container } from "./styles"; */

const GoogleIcon = ({ className }: { className?: string }): JSX.Element => {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-brand-google"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="white"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8" />
      </svg>
    </div>
  );
};

export default GoogleIcon;
