import LoginForm from "@/components/auth/LoginForm";
import CloudBackground from "@/components/ui/CloudBackground";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <CloudBackground heightClassName="min-h-screen">
      <div className="flex items-center justify-center min-h-screen px-4">
        <LoginForm />
      </div>
    </CloudBackground>
  );
}