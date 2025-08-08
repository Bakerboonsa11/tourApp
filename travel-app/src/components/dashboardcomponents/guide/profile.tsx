'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { User, Mail, Phone, Globe, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

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

  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${encodeURIComponent(email)}`);
        setUser(response.data.data);
        console.log('image is ',response.data.data.image)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [session]);

  if (!user) {
    return <div className="text-white p-10">Loading profile...</div>;
  }

  // Format createdAt nicely
  const createdAtFormatted = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f4032] via-[#14532d] to-[#1e3a22] p-10 text-white">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20 animate-fadeIn">
        <div className="flex flex-col items-center space-y-6 mb-10">
          {/* Avatar with edit link */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden bg-gradient-to-tr from-green-600 via-emerald-500 to-lime-400 p-[3px] shadow-xl">
            <div className="rounded-full overflow-hidden w-full h-full">
              <img
                src={`/userimages/${user.image}` || '/pro.png'}
                alt={`${user.name} Avatar`}
                className="object-cover w-full h-full"
              />
            </div>
            <Link
              href="/edituser"
              className="absolute bottom-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 shadow-md"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>

          {/* Name */}
          <h1 className="text-4xl font-bold tracking-wide text-white drop-shadow-md">{user.name}</h1>

          {/* Edit Profile Link */}
          <Link
            href="/edituser"
            className="text-sm text-lime-300 hover:underline transition duration-300"
          >
            Edit Profile
          </Link>
        </div>

        {/* User info display */}
        <div className="space-y-8">
          {[
            { label: 'Name', icon: <User />, value: user.name },
            { label: 'Email', icon: <Mail />, value: user.email },
            { label: 'Phone', icon: <Phone />, value: user.phoneNumber || 'N/A' },
            { label: 'Location', icon: <Globe />, value: user.location || 'N/A' },
            { label: 'Member Since', icon: <User />, value: createdAtFormatted },
          ].map(({ label, icon, value }) => (
            <div key={label} className="relative">
              <label className="absolute left-4 -top-3 bg-[#1e3a22] text-xs px-1 text-lime-200">
                {label}
              </label>
              <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white">
                {icon}
                <span className="ml-3">{value}</span>
              </div>
            </div>
          ))}

          {/* Social media links */}
          {user.socialMedia && (
            <div>
              <label className="block mb-1 text-sm text-lime-200 flex items-center gap-2">
                Social Media
              </label>
              <div className="flex space-x-6 text-white">
                {user.socialMedia.facebook && (
                  <a
                    href={user.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime-400 flex items-center gap-1"
                  >
                    <Facebook className="w-5 h-5" /> Facebook
                  </a>
                )}
                {user.socialMedia.twitter && (
                  <a
                    href={user.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime-400 flex items-center gap-1"
                  >
                    <Twitter className="w-5 h-5" /> Twitter
                  </a>
                )}
                {user.socialMedia.instagram && (
                  <a
                    href={user.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime-400 flex items-center gap-1"
                  >
                    <Instagram className="w-5 h-5" /> Instagram
                  </a>
                )}
                {user.socialMedia.linkedin && (
                  <a
                    href={user.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime-400 flex items-center gap-1"
                  >
                    <Linkedin className="w-5 h-5" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
