'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');
  const year = new Date().getFullYear();

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-green-100 min-h-screen text-gray-800">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[350px] mt-[100px]"
        style={{ backgroundImage: "url('/static/ethiopia-landscape.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center drop-shadow-lg">
            {t('heroTitle')}
          </h2>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-bold text-green-800 mb-4">{t('aboutTitle')}</h3>
        <p className="mb-6 leading-relaxed text-lg text-gray-700">{t('aboutText')}</p>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100 hover:shadow-lg transition">
            <h4 className="text-green-700 font-bold mb-2">{t('features.destinationsTitle')}</h4>
            <p>{t('features.destinationsText')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100 hover:shadow-lg transition">
            <h4 className="text-green-700 font-bold mb-2">{t('features.travelTitle')}</h4>
            <p>{t('features.travelText')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100 hover:shadow-lg transition">
            <h4 className="text-green-700 font-bold mb-2">{t('features.guidesTitle')}</h4>
            <p>{t('features.guidesText')}</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <img
            src="/static/ethio2.png"
            alt="Ethiopian Culture"
            className="rounded-2xl shadow-md w-full object-cover"
          />
          <div>
            <h3 className="text-2xl font-bold text-green-800 mb-4">{t('missionTitle')}</h3>
            <p className="mb-4 text-lg">{t('missionText')}</p>
            <ul className="space-y-2 text-gray-700">
              <li>{t('missionList.eco')}</li>
              <li>{t('missionList.local')}</li>
              <li>{t('missionList.cultural')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-700 py-12 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">{t('ctaTitle')}</h3>
        <p className="mb-6">{t('ctaText')}</p>
        <Link
          href="/tours/all"
          className="bg-yellow-400 text-green-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition"
        >
          {t('ctaButton')}
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>{t('footerText', { year })}</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-yellow-300">{t('footerLinks.facebook')}</a>
            <a href="#" className="hover:text-yellow-300">{t('footerLinks.instagram')}</a>
            <a href="#" className="hover:text-yellow-300">{t('footerLinks.twitter')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
