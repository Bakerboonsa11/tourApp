'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<null | { type: string; text: string }>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forget-password", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email }),
});

  


      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.message || "Something went wrong" });
      } else {
        setMessage({ type: "success", text: data.message });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to send reset link" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <button onClick={() => router.back()} className="flex items-center text-sm text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
        <p className="text-sm text-gray-600">Enter your email address and we’ll send you a password reset link.</p>

        {message && (
          <div className={`p-3 rounded-md text-sm ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSendLink} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 text-white" disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Send Link"}
          </Button>
        </form>

        <p className="text-sm text-gray-600">
          Remember your password? <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
