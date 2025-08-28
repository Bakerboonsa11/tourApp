'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface EditFields {
  name: string;
  email: string;
  password: string;
  image: string; // URL
  imageFile: File | null; // uploaded file
  location: string;
  phoneNumber: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
}

export type User = {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'guide' | 'admin';
  photo?: string;
  location?: string;
  phoneNumber?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
};

export default function Formedit() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
    const router = useRouter();
  

  const [editFields, setEditFields] = useState<EditFields>({
    name: '',
    email: '',
    password: '',
    image: '',
    imageFile: null,
    location: '',
    phoneNumber: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/user/${session?.user.email}`);
        const fetchedUser: User = res.data.data;
        setCurrentUser(fetchedUser);

        // Update form state with user info
        setEditFields((prev) => ({
          ...prev,
          name: fetchedUser.name || '',
          email: fetchedUser.email || '',
          location: fetchedUser.location || '',
          image: fetchedUser.photo || '',
          phoneNumber: fetchedUser.phoneNumber || '',
          socialMedia: {
            facebook: fetchedUser.socialMedia?.facebook || '',
            twitter: fetchedUser.socialMedia?.twitter || '',
            instagram: fetchedUser.socialMedia?.instagram || '',
            linkedin: fetchedUser.socialMedia?.linkedin || '',
          },
        }));
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.id) fetchUser();
  }, [session]);

  const handleFieldChange = (field: keyof EditFields, value: unknown) => {
    setEditFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFields((prev) => ({
        ...prev,
        imageFile: file,
        image: URL.createObjectURL(file), // for preview
      }));
    }
  };

  const handleSocialChange = (platform: keyof EditFields['socialMedia'], value: string) => {
    setEditFields((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }));
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    setLoading(true);

    formData.append('name', editFields.name);
    formData.append('email', editFields.email);
    formData.append('password', editFields.password);
    formData.append('location', editFields.location);
    formData.append('phoneNumber', editFields.phoneNumber);

    formData.append('socialMedia', JSON.stringify(editFields.socialMedia));

    if (editFields.imageFile) {
      formData.append('image', editFields.imageFile);
    }

    try {
      const res = await fetch(`/api/user/updates/${currentUser?._id}`, {
        method: 'PATCH',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert('User updated successfully!');
        // Optionally refresh or redirect
        router.back();
      } else {
        alert(result.message || 'Failed to update the user.');
      }
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleCancelEdit = () => {
    if (!currentUser) return;
    setEditFields({
      name: currentUser.name,
      email: currentUser.email,
      password: '',
      image: currentUser.photo || '',
      imageFile: null,
      location: currentUser.location || '',
      phoneNumber: currentUser.phoneNumber || '',
      socialMedia: {
        facebook: currentUser.socialMedia?.facebook || '',
        twitter: currentUser.socialMedia?.twitter || '',
        instagram: currentUser.socialMedia?.instagram || '',
        linkedin: currentUser.socialMedia?.linkedin || '',
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-10 mt-16 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-shadow duration-500">
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 mb-10 text-center tracking-tight">
        Update User Profile
      </h2>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <input
          type="text"
          placeholder="Name"
          value={editFields.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition duration-300 placeholder:text-gray-400"
        />
        <input
          type="email"
          placeholder="Email"
          value={editFields.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition duration-300 placeholder:text-gray-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={editFields.password}
          onChange={(e) => handleFieldChange('password', e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition duration-300 placeholder:text-gray-400"
        />
        <input
          type="text"
          placeholder="Location"
          value={editFields.location}
          onChange={(e) => handleFieldChange('location', e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition duration-300 placeholder:text-gray-400"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={editFields.phoneNumber}
          onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition duration-300 placeholder:text-gray-400"
        />
  
        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-cyan-500 file:text-white hover:file:brightness-110 transition duration-300"
        />
        {editFields.image && (
          <img
            src={editFields.image}
            alt="Profile Preview"
            className="h-32 w-32 rounded-full object-cover shadow-xl border-4 border-white ring-4 ring-cyan-200 mx-auto md:mx-0 transition-transform duration-300 hover:scale-105"
          />
        )}
  
        {/* Social Media Inputs */}
        {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
          <input
            key={platform}
            type="text"
            placeholder={platform[0].toUpperCase() + platform.slice(1)}
            value={editFields.socialMedia[platform as keyof typeof editFields.socialMedia]}
            onChange={(e) =>
              handleSocialChange(platform as keyof typeof editFields.socialMedia, e.target.value)
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition duration-300 placeholder:text-gray-400"
          />
        ))}
      </div>
  
      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-12">
        <button
          type="button"
          onClick={handleCancelEdit}
          className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition duration-300 shadow-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveEdit}
          className="px-6 py-3 rounded-xl font-semibold shadow-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:brightness-110 hover:scale-105 transition-all duration-300"
        >
         {loading? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
  
  
}

