import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({
  className,
  type = "text",
  error = false,
  ...props
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-3 py-2 bg-white border rounded-md transition-all duration-200",
        "font-body text-gray-900 placeholder-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
        error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-gray-200 hover:border-gray-300",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;