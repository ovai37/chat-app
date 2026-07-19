import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${className}`}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
