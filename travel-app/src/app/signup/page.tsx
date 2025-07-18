'use client'

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Account created successfully!');
        await signIn('credentials', { email, password, redirect: true, callbackUrl: '/' });
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-white via-gray-100 to-gray-200 py-10 px-4">

      {/* Top Branding */}
      <div className="w-full max-w-md text-center mb-6">
        <h1 className="text-3xl font-bold">MyTour ✈️</h1>
        <p className="text-gray-600 text-sm">Create your free account and start your adventure!</p>
      </div>

      {/* Main Signup Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-5">

        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center text-sm text-gray-500 mb-2 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <h2 className="text-xl font-bold">Create Account 🚀</h2>
        <p className="text-gray-500 text-sm">Sign up to access your account</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              className="border rounded-md px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="border rounded-md px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="border rounded-md px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Sign In</Link>
            </span>
          </div>

          <Button type="submit" className="w-full bg-black text-white hover:bg-neutral-800" disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Sign Up'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignup}
          >
            <FcGoogle className="w-5 h-5" /> Continue with Google
          </Button>
        </form>
      </div>

      {/* Bottom Static Footer */}
      <div className="w-full max-w-md text-center mt-6 text-sm text-gray-700 space-y-2">
        <p>By signing up, you agree to our <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.</p>
        <p>Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact support</a></p>
      </div>
    </div>
  );
}
