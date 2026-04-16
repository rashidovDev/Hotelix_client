"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/config/routes";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";


export default function LoginForm() {
  const { login, loginLoading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const validate = () => {
    const newErrors = { email: "", password: "", general: "" };
    let valid = true;

    if (!form.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await login({ email: form.email, password: form.password });
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error?.message || "Login failed. Please try again.",
      }));
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-lg flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back 👋</h1>
        <p className="text-gray-500 text-sm">Login to your Hotelix account</p>
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {errors.general}
        </div>
      )}

      {/* Form */}
      <div className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />
      </div>

      {/* Submit */}
      <Button loading={loginLoading} onClick={handleSubmit}>
        Login
      </Button>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link href={routes.register} className="text-blue-600 font-medium hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}