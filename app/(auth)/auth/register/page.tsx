import RegisterForm from "@/components/auth/RegisterForm";
import CloudBackground from "@/components/ui/CloudBackground";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
     
      <div className="flex -mt-30 items-center justify-center min-h-screen px-4">
        <RegisterForm />
      </div>
  
  );
}