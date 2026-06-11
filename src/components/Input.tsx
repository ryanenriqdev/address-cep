import { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement> ) {
  return (
    <input
      className="block border border-gray-400 p-2 w-lg outline-none focus:ring-2 focus:ring-gray-200"
      {...props}
    />
  );
}
