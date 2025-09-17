'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('signup');

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
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-green-50 via-green-100 to-green-200 dark:from-gray-800 dark:via-gray-900 dark:to-black py-10 px-4">
  
      {/* Top Branding */}
      <div className="w-full max-w-2xl text-center mb-6">
        <h1 className="text-4xl font-extrabold text-green-700 dark:text-green-400">{t('joinTitle')}</h1>
        <p className="text-green-900 dark:text-gray-300 text-md mt-2">{t('joinSubtitle')}</p>
      </div>
  
      {/* Signup Card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6 border border-green-100 dark:border-gray-700">
  
        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center text-sm text-green-600 dark:text-green-400 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> {t('back')}
        </button>
  
        <h2 className="text-2xl font-bold text-green-700 dark:text-white">{t('createAccount')}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{t('signupPrompt')}</p>
  
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-green-800 dark:text-green-300">{t('name')}</label>
            <input
              type="text"
              className="border border-green-300 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
  
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-green-800 dark:text-green-300">{t('email')}</label>
            <input
              type="email"
              className="border border-green-300 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
  
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-green-800 dark:text-green-300">{t('password')}</label>
            <input
              type="password"
              className="border border-green-300 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
  
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              {t('alreadyAccount')} <Link href="/login" className="text-green-700 dark:text-green-400 hover:underline">{t('signIn')}</Link>
            </span>
          </div>
  
          <Button type="submit" className="w-full bg-green-600 text-white hover:bg-green-700" disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : t('signUp')}
          </Button>
  
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-green-500 text-green-800 dark:text-white dark:border-gray-500 hover:bg-green-100 dark:hover:bg-gray-700"
            onClick={handleGoogleSignup}
          >
            <FcGoogle className="w-5 h-5" /> {t('continueGoogle')}
          </Button>
        </form>
      </div>
  
      {/* Static Content - Why Join Section */}
      <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-xl border-l-4 border-green-500 dark:border-green-400">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🌟 {t('feature1Title')}</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{t('feature1Desc')}</p>
        </div>
  
        <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-xl border-l-4 border-green-500 dark:border-green-400">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📍 {t('feature2Title')}</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{t('feature2Desc')}</p>
        </div>
  
        <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-xl border-l-4 border-green-500 dark:border-green-400">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🧑 {t('feature3Title')}</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{t('feature3Desc')}</p>
        </div>
  
        <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-xl border-l-4 border-green-500 dark:border-green-400">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">💬 {t('feature4Title')}</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{t('feature4Desc')}</p>
        </div>
      </div>
  
      {/* Footer */}
      <div className="w-full max-w-md text-center mt-8 text-sm text-gray-700 dark:text-gray-300 space-y-2">
        <p>{t('termsAgreement1')} <a href="/terms" className="text-green-700 dark:text-green-400 hover:underline">{t('termsOfService')}</a> {t('and')} <a href="/privacy" className="text-green-700 dark:text-green-400 hover:underline">{t('privacyPolicy')}</a>.</p>
        <p>{t('needHelp')} <a href="/contact" className="text-green-700 dark:text-green-400 hover:underline">{t('contactSupport')}</a></p>
      </div>
    </div>
  );
  
}
