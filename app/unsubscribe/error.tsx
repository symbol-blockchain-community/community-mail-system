"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: (e: any) => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="flex h-full flex-col items-center justify-center min-h-screen">
      <h2 className="text-center">{error.name}</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={() => reset({ tes: 100 })}
      >
        Try again
      </button>
    </main>
  );
}
