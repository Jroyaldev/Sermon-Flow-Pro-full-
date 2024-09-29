import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Sign in to Sermon Flow Pro</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <SignIn />
      </div>
    </div>
  );
}