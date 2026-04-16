"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/config/routes";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Role } from "@/types";

export default function RegisterForm() {
  const { register, registerLoading } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: Role.Guest,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const validate = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    };
    let valid = true;

    if (!form.firstName) {
      newErrors.firstName = "First name is required";
      valid = false;
    }

    if (!form.lastName) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }

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

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: form.role,
      });
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error?.message || "Registration failed. Please try again.",
      }));
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-lg flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800">Create account 🏨</h1>
        <p className="text-gray-500 text-sm">
          Join Hotelix and find your perfect stay
        </p>
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {errors.general}
        </div>
      )}

      {/* Form */}
      <div className="flex flex-col gap-4">
        {/* Name Row */}
        <div className="flex gap-3">
          <Input
            label="First Name"
            type="text"
            placeholder="John"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            error={errors.firstName}
          />
          <Input
            label="Last Name"
            type="text"
            placeholder="Doe"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            error={errors.lastName}
          />
        </div>

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

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          error={errors.confirmPassword}
        />

        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-700">I am a</label>
          <div className="grid grid-cols-2 rounded-xl border border-gray-200 bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: Role.Guest })}
              className={`rounded-lg py-2 text-sm font-medium transition-all ${
                form.role === Role.Guest
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-gray-700 hover:bg-gray-100"
              }`}
            >
              Guest
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: Role.Host })}
              className={`rounded-lg py-2 text-sm font-medium transition-all ${
                form.role === Role.Host
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-gray-700 hover:bg-gray-100"
              }`}
            >
              Host
            </button>
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button loading={registerLoading} onClick={handleSubmit}>
        Create Account
      </Button>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href={routes.login}
          className="text-blue-600 font-medium hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}