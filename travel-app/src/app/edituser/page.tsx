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
    <div className="max-w-4xl mx-auto p-8 mt-12 bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl border border-gray-100">
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 mb-8 text-center">
        Update User Profile
      </h2>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <input
          type="text"
          placeholder="Name"
          value={editFields.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          className="input-style"
        />
        <input
          type="email"
          placeholder="Email"
          value={editFields.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          className="input-style"
        />
        <input
          type="password"
          placeholder="Password"
          value={editFields.password}
          onChange={(e) => handleFieldChange('password', e.target.value)}
          className="input-style"
        />
        <input
          type="text"
          placeholder="Location"
          value={editFields.location}
          onChange={(e) => handleFieldChange('location', e.target.value)}
          className="input-style"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={editFields.phoneNumber}
          onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
          className="input-style"
        />
  
        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input-style"
        />
        {editFields.image && (
          <img
            src={editFields.image}
            alt="Profile Preview"
            className="h-32 w-32 rounded-full object-cover shadow-lg border-4 border-white mx-auto md:mx-0"
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
            className="input-style"
          />
        ))}
      </div>
  
      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-10">
        <button
          type="button"
          onClick={handleCancelEdit}
          className="btn-style bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveEdit}
          className="btn-style bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:brightness-110"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
  
}


// InputBlock Component
// function InputBlock({ label, type = 'text', value, onChange, placeholder = '' }: InputBlockProps) {
//   return (
//     <div>
//       <Label label={label} />
//       <input
//         type={type}
//         placeholder={placeholder || label}
//         value={value}
//         onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
//         className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400"
//       />
//     </div>
//   );
// }

// // Label Component
// function Label({ label }: LabelProps) {
//   return <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>;
// }
