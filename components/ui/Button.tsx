import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "outline";
}

export default function Button({
  loading,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full bg-red z-50 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
        ${variant === "primary"
          ? "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
          : "border border-gray-200 hover:bg-gray-50 text-gray-700"
        }
        ${props.className || ""}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}