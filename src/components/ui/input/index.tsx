import cn from "@/utils/cn";
import { useId, type HTMLProps } from "react";

type PropsType = Omit<HTMLProps<HTMLInputElement>, "label"> & {
  label: string;
  required?: boolean;
  errorMessage?: string;
  error?: boolean;
};

export function InputGroup({
  label,
  className,
  error,
  errorMessage,
  ...props
}: PropsType) {
  const id = useId();
  return (
    <div className={`${props.type === "checkbox" ? "flex flex-row-reverse justify-end items-center gap-2" : ""}`}>
      <label
        htmlFor={id}
        className={`
          block text-sm font-normal text-gray-6
          ${props.type === "checkbox" ? "mb-0" : "mb-1.5"}
        `}
      >
        {label} {props?.required && <span className="text-red">*</span>}
      </label>

      <input
        id={id}
        {...props}
        className={cn(`
          border border-gray-3 focus:border-blue focus:outline-0 
          placeholder:text-sm text-sm placeholder:font-normal placeholder:text-dark-5 
          py-2.5 px-4 duration-200 focus:ring-0 
          ${props.type === "checkbox" ? "w-5 h-5 p-2 rounded-sm" : "w-full h-11 rounded-lg"}
        `,
          className,
          {
            "border-red": error,
          }
        )}
      />

      {error && <p className="text-sm text-red mt-1.5">{errorMessage}</p>}
    </div>
  );
}
