import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        {...props}
        className={`w-full px-4 py-3 rounded-xl border outline-none text-gray-800 text-sm transition-all
          ${error
            ? "border-red-400 focus:border-red-500 bg-red-50"
            : "border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white"
          }`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}