import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({
  className,
  checked = false,
  onChange,
  ...props
}, ref) => {
  return (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        {...props}
      />
      <div
        className={cn(
          "w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer flex items-center justify-center",
          checked
            ? "bg-gradient-to-r from-primary to-secondary border-primary shadow-sm"
            : "bg-white border-gray-300 hover:border-gray-400",
          className
        )}
        onClick={() => onChange?.({ target: { checked: !checked } })}
      >
        {checked && (
          <ApperIcon
            name="Check"
            size={14}
            className="text-white animate-in zoom-in-75 duration-200"
          />
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;