'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FcGoogle, FcServices } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('login');
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
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-green-50 via-green-100 to-green-200 dark:from-gray-800 dark:via-gray-900 dark:to-black py-10 px-4">
  
      {/* Top Banner */}
      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-extrabold text-green-700 dark:text-green-400">{t('welcomeTitle')}</h1>
        <p className="text-green-900 dark:text-gray-300 text-md mt-2">{t('welcomeSubtitle')}</p>
      </div>
  
      {/* Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6 border border-green-100 dark:border-gray-700">
  
        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center text-sm text-green-600 dark:text-green-400 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> {t('back')}
        </button>
  
        <h2 className="text-2xl font-bold text-green-700 dark:text-white">{t('welcomeBack')}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{t('signInPrompt')}</p>
  
        <form onSubmit={handleLogin} className="space-y-4">
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
              {t('noAccount')} <Link href={`/${locale}/signup`} className="text-green-700 dark:text-green-400 hover:underline">{t('signUp')}</Link>
            </span>
            <a href="/forgot-password" className="text-green-700 dark:text-green-400 hover:underline">{t('forgotPassword')}</a>
          </div>
  
          <Button type="submit" className="w-full bg-green-600 text-white hover:bg-green-700" disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : t('login')}
          </Button>
  
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-green-500 text-green-800 dark:text-white dark:border-gray-500 hover:bg-green-100 dark:hover:bg-gray-700"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="w-5 h-5" /> {t('continueGoogle')}
          </Button>
        </form>
      </div>
  
      {/* Static Content Section */}
      <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-xl border-l-4 border-green-500 dark:border-green-400">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🌍 {t('feature1Title')}</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{t('feature1Desc')}</p>
        </div>
  
        <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-xl border-l-4 border-green-500 dark:border-green-400">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">💼 {t('feature2Title')}</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{t('feature2Desc')}</p>
        </div>
  
        <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-xl border-l-4 border-green-500 dark:border-green-400">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🧳 {t('feature3Title')}</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{t('feature3Desc')}</p>
        </div>
  
        <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-xl border-l-4 border-green-500 dark:border-green-400">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">⭐ {t('feature4Title')}</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{t('feature4Desc')}</p>
        </div>
      </div>
  
      {/* Footer */}
      <div className="w-full max-w-md text-center mt-8 text-sm text-gray-700 dark:text-gray-300 space-y-2">
        <div className="flex justify-center gap-2 items-center">
          <FcServices className="w-5 h-5" />
          <span>{t('ssoMessage')}</span>
        </div>
        <p>{t('needHelp')} <a href="/contact" className="text-green-700 dark:text-green-400 hover:underline">{t('contactSupport')}</a></p>
      </div>
    </div>
  );
  
}