'use client'


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FcGoogle, FcServices } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession,signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);
    if (res?.error) {
      alert('Invalid credentials');
    } else {
      router.push('/');
    }
  };

  const handleGoogleLogin = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-white via-gray-100 to-gray-200 py-10 px-4">

      {/* Top Header */}
      <div className="w-full max-w-md text-center mb-6">
        <h1 className="text-3xl font-bold">MyTour ✈️</h1>
        <p className="text-gray-600 text-sm">Login to your account to explore amazing destinations.</p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-5">

        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center text-sm text-gray-500 mb-2 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <h2 className="text-xl font-bold">Welcome Back 👋</h2>
        <p className="text-gray-500 text-sm">Please sign in to continue</p>

        <form onSubmit={handleLogin} className="space-y-4">
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
              No account? < Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
            </span>
            <a href="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</a>
          </div>

          <Button type="submit" className="w-full bg-black text-white hover:bg-neutral-800" disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Login'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="w-5 h-5" /> Continue with Google
          </Button>
        </form>
      </div>

      {/* Bottom Informational Footer */}
      <div className="w-full max-w-md text-center mt-6 text-sm text-gray-700 space-y-2">
        <div className="flex justify-center gap-2 items-center">
          <FcServices className="w-5 h-5" />
          <span>We also offer SSO for organizations.</span>
        </div>
        <p>Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact support</a></p>
      </div>
    </div>
  );
}
