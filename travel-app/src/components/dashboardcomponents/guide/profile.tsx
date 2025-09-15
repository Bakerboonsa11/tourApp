'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { User, Mail, Phone, Globe, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'guide';
  password?: string;
  createdAt: string;
  location?: string;
  phoneNumber?: string;
  image?: string;
  socialMedia?: SocialMedia;
}

export default function GuideProfile() {
  const [user, setUser] = useState<IUser | null>(null);
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations('guideDashboard');
  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${encodeURIComponent(email)}`);
        setUser(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [session]);

  if (!user) {
    return <div className="text-white p-10 text-center text-xl">Loading profile...</div>;
  }

  const createdAtFormatted = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f4032] via-[#14532d] to-[#1e3a22] p-10 flex justify-center items-start">
      <div className="max-w-4xl w-full bg-white/5 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/10 p-10 flex flex-col items-center space-y-12 animate-fadeIn">
        
        {/* Avatar & Name */}
        <div className="relative group">
          <div className="relative w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-green-500 via-lime-400 to-emerald-400 shadow-lg">
            <div className="rounded-full overflow-hidden w-full h-full border-4 border-white/20 group-hover:scale-105 transition-transform duration-300">
              <img
                src={user.image ? `/userimages/${user.image}` : '/pro.png'}
                alt={`${user.name} Avatar`}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <Link
            href={`/${locale}/edituser`}
            className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 shadow-md transition"
          >
            <User className="w-6 h-6" />
          </Link>
        </div>
  
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-tight">{user.name}</h1>
          <Link
            href={`/${locale}/edituser`}
            className="text-lime-300 hover:text-lime-400 transition text-sm font-medium"
          >
            {t("pro.Edit Profile")}
          </Link>
        </div>
  
        {/* Info Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: t("pro.Name"), icon: <User className="text-lime-300 w-5 h-5" />, value: user.name },
            { label: t("pro.Email"), icon: <Mail className="text-lime-300 w-5 h-5" />, value: user.email },
            { label: t("pro.Phone"), icon: <Phone className="text-lime-300 w-5 h-5" />, value: user.phoneNumber || 'N/A' },
            { label: t("pro.Location"), icon: <Globe className="text-lime-300 w-5 h-5" />, value: user.location || 'N/A' },
            { label: t("pro.Member Since"), icon: <User className="text-lime-300 w-5 h-5" />, value: createdAtFormatted },
          ].map(({ label, icon, value }) => (
            <div
              key={label}
              className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-5 py-4 shadow-lg hover:shadow-2xl transition duration-300"
            >
              {icon}
              <div className="flex flex-col">
                <span className="text-lime-200 text-xs">{label}</span>
                <span className="text-white font-medium">{value}</span>
              </div>
            </div>
          ))}
        </div>
  
        {/* Social Media */}
        {user.socialMedia && (
          <div className="w-full flex flex-col items-center space-y-3">
            <span className="text-lime-200 font-semibold">{t("pro.Connect on Social Media")}</span>
            <div className="flex gap-6 flex-wrap justify-center">
              {user.socialMedia.facebook && (
                <a
                  href={user.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-lime-400 transition transform hover:scale-110"
                >
                  <Facebook className="w-5 h-5" /> {t("pro.Facebook")}
                </a>
              )}
              {user.socialMedia.twitter && (
                <a
                  href={user.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-lime-400 transition transform hover:scale-110"
                >
                  <Twitter className="w-5 h-5" /> {t("pro.Twitter")}
                </a>
              )}
              {user.socialMedia.instagram && (
                <a
                  href={user.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-lime-400 transition transform hover:scale-110"
                >
                  <Instagram className="w-5 h-5" /> {t("pro.Instagram")}
                </a>
              )}
              {user.socialMedia.linkedin && (
                <a
                  href={user.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-lime-400 transition transform hover:scale-110"
                >
                  <Linkedin className="w-5 h-5" /> {t("pro.LinkedIn")}
                </a>
              )}
            </div>
          </div>
        )}
  
      </div>
    </div>
  );
  
}
