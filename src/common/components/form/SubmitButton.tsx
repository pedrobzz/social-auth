/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";

/* import { Container } from "./styles"; */

const SubmitButton = ({
  loading,
  onClick,
  children,
}: {
  loading?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}): JSX.Element => {
  return (
    <button
      className={`relative px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 w-full disabled:opacity-25 disabled:cursor-not-allowed`}
      disabled={loading}
      onClick={onClick}
    >
      <svg
        className={`absolute ${
          loading ? "animate-spin block ml-[-10px] xs:ml-0" : "hidden"
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
      {children}
    </button>
  );
};

export default SubmitButton;
