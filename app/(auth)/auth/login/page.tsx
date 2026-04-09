import LoginForm from "@/components/auth/LoginForm";
import CloudBackground from "@/components/ui/CloudBackground";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
   
      <div className="flex -mt-30 items-center justify-center min-h-screen px-4">
        <LoginForm />
      </div>
  
  );
}