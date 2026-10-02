"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";
import { api, ApiError } from "@/lib/api-client";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import type { User } from "@/lib/types";

export function LoginForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      await api.post<{ user: User }>("/api/auth/login", values);
      await refresh();
      router.push("/portal");
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
      setFormError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex w-full max-w-sm flex-col gap-5">
      {formError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      <Input
        label="Username"
        type="text"
        autoComplete="email"
        placeholder="User Name / Email ID / Employee ID"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        placeholder="Password"
        error={errors.password?.message}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="text-muted hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        {...register("password")}
      />

      <Button type="submit" size="lg" loading={isSubmitting} className="mt-1 w-full">
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 appearance-none rounded-full border-2 border-chip-border bg-white checked:border-primary checked:bg-primary"
          />
          Remember Login Info
        </label>
        <button
          type="button"
          onClick={() => toast.info("Password reset isn't available in this demo.")}
          className="font-medium text-info underline underline-offset-2 hover:opacity-80"
        >
          Forgot Password?
        </button>
      </div>
    </form>
  );
}
