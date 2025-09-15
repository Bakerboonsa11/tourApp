'use client';

import React, { useState } from 'react';
import { Mail, Phone, Linkedin, Twitter, Instagram, Facebook, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function GreenWaveFAQContact() {
  const t = useTranslations('faq');

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const faqs = [
    { q: t('faqs.0.q'), a: t('faqs.0.a') },
    { q: t('faqs.1.q'), a: t('faqs.1.a') },
    { q: t('faqs.2.q'), a: t('faqs.2.a') },
    { q: t('faqs.3.q'), a: t('faqs.3.a') },
    { q: t('faqs.4.q'), a: t('faqs.4.a') }
  ];

  function toggleFAQ(i: number) {
    setOpenIndex(openIndex === i ? null : i);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`${t('mailtoSubjectPrefix')} ${form.name || t('visitorFallback')}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:contact@yourdomain.com?subject=${subject}&body=${body}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 text-slate-900">
      {/* HEADER */}
      <header className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-emerald-900">
          {t('title')}
        </h1>
        <p className="mt-4 text-lg text-emerald-800/90">{t('subtitle')}</p>
        <div className="mt-6 space-x-3">
          <a
            href="mailto:contact@yourdomain.com"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-2xl shadow-md"
          >
            <Mail size={18} /> {t('btnEmailUs')}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border border-emerald-700 text-emerald-700 px-4 py-2 rounded-2xl hover:bg-emerald-50"
          >
            {t('btnContact')}
          </a>
        </div>
      </header>

      {/* FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-3xl shadow-lg">
        <h2 className="text-2xl font-bold text-emerald-900 mb-6 text-center">{t('faqTitle')}</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <article key={i} className="border border-emerald-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(i)}
                className="w-full flex items-center justify-between p-4 text-left bg-gradient-to-r from-emerald-50 to-transparent hover:bg-emerald-50"
                aria-expanded={openIndex === i}
              >
                <div>
                  <h3 className="font-semibold text-emerald-900">{f.q}</h3>
                  <p className="text-sm text-emerald-700/80 mt-1">{t('faqItemHint')}</p>
                </div>
                <ChevronDown className={`transform transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <div className={`px-4 pb-4 transition-all duration-300 ${openIndex === i ? 'max-h-96 pt-4' : 'max-h-0 overflow-hidden'}`}>
                <p className="text-emerald-800/95 leading-relaxed">{f.a}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="max-w-3xl mx-auto px-6 py-12 bg-white/90 rounded-3xl shadow-lg mt-12">
        <h3 className="text-xl font-bold text-emerald-900 mb-4 text-center">{t('contactTitle')}</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-emerald-800 font-medium">{t('labelName')}</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-emerald-100 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder={t('phName')}
            />
          </div>
          <div>
            <label className="block text-sm text-emerald-800 font-medium">{t('labelEmail')}</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-emerald-100 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder={t('phEmail')}
            />
          </div>
          <div>
            <label className="block text-sm text-emerald-800 font-medium">{t('labelMessage')}</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              required
              className="mt-2 w-full rounded-xl border border-emerald-100 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder={t('phMessage')}
            />
          </div>
          <div className="flex flex-col gap-3">
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-3 rounded-2xl font-semibold shadow">
              {t('btnSend')}
            </button>
            <button
              type="button"
              onClick={() => setForm({ name: '', email: '', message: '' })}
              className="w-full inline-flex items-center justify-center border border-emerald-200 px-4 py-3 rounded-2xl"
            >
              {t('btnClear')}
            </button>
          </div>
        </form>

        {/* Social Links */}
        <div className="mt-6 border-t border-emerald-100 pt-4">
          <h4 className="text-sm font-semibold text-emerald-900">{t('socialTitle')}</h4>
          <p className="text-sm text-emerald-700 mt-2">{t('socialDesc')}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="https://twitter.com/yourprofile" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-100 hover:bg-emerald-50">
              <Twitter size={16} /> Twitter
            </a>
            <a href="https://linkedin.com/company/yourprofile" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-100 hover:bg-emerald-50">
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href="https://instagram.com/yourprofile" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-100 hover:bg-emerald-50">
              <Instagram size={16} /> Instagram
            </a>
            <a href="https://facebook.com/yourprofile" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-100 hover:bg-emerald-50">
              <Facebook size={16} /> Facebook
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-12 py-8 border-t border-emerald-100 text-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold shadow">GW</div>
          <p className="mt-2 text-sm font-semibold text-emerald-900">{t('brand')}</p>
          <p className="text-xs text-emerald-700">© {new Date().getFullYear()} {t('brand')} — {t('rightsReserved')}</p>
        </div>
      </footer>

      {/* Floating Help Button */}
      <a href="mailto:contact@yourdomain.com" className="fixed bottom-6 right-6 bg-emerald-700 text-white p-3 rounded-full shadow-lg flex items-center gap-2">
        <Mail size={16} /> <span className="hidden sm:inline">{t('help')}</span>
      </a>
    </div>
  );
}
