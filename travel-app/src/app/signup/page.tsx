'use client';

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
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-green-50 via-green-100 to-green-200 py-10 px-4">

      {/* Top Branding */}
      <div className="w-full max-w-2xl text-center mb-6">
        <h1 className="text-4xl font-extrabold text-green-700">Join MyTour ✈️</h1>
        <p className="text-green-900 text-md mt-2">Create your account to start booking and exploring new adventures.</p>
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-green-100">

        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center text-sm text-green-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <h2 className="text-2xl font-bold text-green-700">Create Account 🚀</h2>
        <p className="text-gray-600 text-sm">Sign up and get started right away</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-green-800">Name</label>
            <input
              type="text"
              className="border border-green-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              Already have an account? <Link href="/login" className="text-green-700 hover:underline">Sign In</Link>
            </span>
          </div>

          <Button type="submit" className="w-full bg-green-600 text-white hover:bg-green-700" disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Sign Up'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-green-500 text-green-800 hover:bg-green-100"
            onClick={handleGoogleSignup}
          >
            <FcGoogle className="w-5 h-5" /> Continue with Google
          </Button>
        </form>
      </div>

      {/* Static Content - Why Join Section */}
      <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 px-4 text-green-800">
        <div className="bg-white shadow-md p-6 rounded-xl border-l-4 border-green-500">
          <h3 className="text-lg font-semibold">🌟 Member-Only Deals</h3>
          <p className="text-sm mt-2">Enjoy exclusive discounts and early access to seasonal packages.</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl border-l-4 border-green-500">
          <h3 className="text-lg font-semibold">📍 Save Your Favorites</h3>
          <p className="text-sm mt-2">Bookmark dream destinations and access them anytime.</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl border-l-4 border-green-500">
          <h3 className="text-lg font-semibold">🧑 Personalized Experience</h3>
          <p className="text-sm mt-2">Receive suggestions based on your travel style and history.</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl border-l-4 border-green-500">
          <h3 className="text-lg font-semibold">💬 24/7 Support</h3>
          <p className="text-sm mt-2">Need help? Our team is always here for you with fast and friendly assistance.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-md text-center mt-8 text-sm text-gray-700 space-y-2">
        <p>By signing up, you agree to our <a href="/terms" className="text-green-700 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-green-700 hover:underline">Privacy Policy</a>.</p>
        <p>Need help? <a href="/contact" className="text-green-700 hover:underline">Contact support</a></p>
      </div>
    </div>
  );
}
