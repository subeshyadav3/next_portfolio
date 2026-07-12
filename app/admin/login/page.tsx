import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const sp = await searchParams;

  if (session?.user) {
    redirect(sp.callbackUrl ?? "/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Admin Login
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Sign in to manage your content
        </p>

        {sp.error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            Invalid email or password. Please try again.
          </div>
        )}

        <LoginForm callbackUrl={sp.callbackUrl} />
      </div>
    </div>
  );
}
