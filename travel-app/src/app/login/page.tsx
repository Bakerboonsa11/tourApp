'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FcGoogle, FcServices } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';

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
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-green-50 via-green-100 to-green-200 py-10 px-4">

      {/* Top Banner */}
      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-extrabold text-green-700">Welcome to MyTour ✈️</h1>
        <p className="text-green-900 text-md mt-2">Your journey begins here. Discover, explore, and book amazing destinations.</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-green-100">

        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center text-sm text-green-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <h2 className="text-2xl font-bold text-green-700">Welcome Back 👋</h2>
        <p className="text-gray-600 text-sm">Please sign in to your account</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-green-800">Email</label>
            <input
              type="email"
              className="border border-green-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-green-800">Password</label>
            <input
              type="password"
              className="border border-green-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              No account? <Link href="/signup" className="text-green-700 hover:underline">Sign up</Link>
            </span>
            <a href="/forgot-password" className="text-green-700 hover:underline">Forgot password?</a>
          </div>

          <Button type="submit" className="w-full bg-green-600 text-white hover:bg-green-700" disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Login'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-green-500 text-green-800 hover:bg-green-100"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="w-5 h-5" /> Continue with Google
          </Button>
        </form>
      </div>

      {/* Static Content Section */}
      <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 px-4 text-green-800">
        {/* Feature 1 */}
        <div className="bg-white shadow-md p-6 rounded-xl border-l-4 border-green-500">
          <h3 className="text-lg font-semibold">🌍 Explore Destinations</h3>
          <p className="text-sm mt-2">Find the best places to visit, from hidden gems to iconic landmarks, curated just for you.</p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white shadow-md p-6 rounded-xl border-l-4 border-green-500">
          <h3 className="text-lg font-semibold">💼 Manage Your Bookings</h3>
          <p className="text-sm mt-2">View, modify, or cancel your tour bookings in one place with ease and clarity.</p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white shadow-md p-6 rounded-xl border-l-4 border-green-500">
          <h3 className="text-lg font-semibold">🧳 Personalized Packages</h3>
          <p className="text-sm mt-2">We tailor experiences to your preferences and interests for the best adventure possible.</p>
        </div>

        {/* Feature 4 */}
        <div className="bg-white shadow-md p-6 rounded-xl border-l-4 border-green-500">
          <h3 className="text-lg font-semibold">⭐ Trusted by Travelers</h3>
          <p className="text-sm mt-2">Join thousands of happy explorers who trust MyTour for unforgettable experiences.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-md text-center mt-8 text-sm text-gray-700 space-y-2">
        <div className="flex justify-center gap-2 items-center">
          <FcServices className="w-5 h-5" />
          <span>We also offer SSO for organizations.</span>
        </div>
        <p>Need help? <a href="/contact" className="text-green-700 hover:underline">Contact support</a></p>
      </div>
    </div>
  );
}
