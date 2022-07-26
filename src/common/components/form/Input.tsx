import React, { InputHTMLAttributes, useState } from "react";

const Input = ({
  inputProps,
  name,
  className,
  onChange,
  required,
  type,
}: {
  name: string;
  className?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
}): JSX.Element => {
  const [isFocused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  return (
    <div className={`relative my-1 ${className}`}>
      <p
        className={`transition-all absolute left-1 text-slate-400 ${
          !isFocused && !value ? "text-lg top-4" : "top-1 text-xs"
        } pointer-events-none`}
      >
        {name}
      </p>
      <input
        autoFocus={true}
        name={name}
        value={value}
        onChange={e => {
          setValue(e.target.value);
          if (onChange) onChange(e);
        }}
        {...inputProps}
        className={`pb-0 pt-5 pl-1 border-b border-slate-400 focus:border-blue-600 focus:outline-none bg-transparent w-full ${inputProps?.className}`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=""
        required={required}
        type={type}
      />
    </div>
  );
};

export default Input;
