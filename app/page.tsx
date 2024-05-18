import Editor from "@/components/editor";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth_options";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-3 space-y-3">
      <div className="w-full flex flex-row space-x-3">
        <h1 className="text-base flex-grow">Symbol mailing list</h1>
        <a href="/api/auth/signout" className="text-blue-500 hover:text-blue-600 text-base">
          signout
        </a>
      </div>
      <Editor />
    </main>
  );
}
