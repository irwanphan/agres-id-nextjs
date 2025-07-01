import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DebugSessionPage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Session</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Information</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <p><strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL}</p>
            <p><strong>NEXTAUTH_SECRET:</strong> {process.env.NEXTAUTH_SECRET ? "Set" : "Not set"}</p>
            <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Access Control</h2>
          <div className="space-y-2">
            <p><strong>Has Session:</strong> {session ? "Yes" : "No"}</p>
            <p><strong>User Role:</strong> {session?.user?.role || "None"}</p>
            <p><strong>Can Access Admin:</strong> {session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER" ? "Yes" : "No"}</p>
            <p><strong>User Email:</strong> {session?.user?.email || "None"}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 