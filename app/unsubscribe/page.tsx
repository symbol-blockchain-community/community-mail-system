import UnRegisterForm from "@/components/unregisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Symbol Mailing List",
  description: "UnSubscribe Page",
};

export default async function UnSubscribe() {
  return (
    <main className="flex min-h-screen flex-col justify-center items-center p-3">
      <div className="flex flex-col justify-center items-center space-y-12 max-w-md w-full">
        <h1 className="text-2xl sm:text-4xl font-semibold">Symbol Mailing List</h1>
      </div>
      <UnRegisterForm />
    </main>
  );
}
