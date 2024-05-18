import RegisterForm from "@/components/registerForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Symbol Mailing List",
  description: "Subscribe",
};

export default async function Subscribe() {
  return (
    <main className="flex min-h-screen flex-col justify-center items-center p-3">
      <div className="flex flex-col justify-center items-center space-y-12 max-w-md w-full">
        <h1 className="text-2xl sm:text-4xl font-semibold">Symbol Mailing List</h1>
      </div>
      <RegisterForm />
    </main>
  );
}
