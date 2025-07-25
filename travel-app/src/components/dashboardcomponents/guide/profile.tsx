'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, User, Mail, Phone, Globe, Award, ClipboardList } from 'lucide-react';


export default function GuideProfile() {
  // Dummy initial guide data
  const [guideData, setGuideData] = useState({
    name: 'Alexandra Smith',
    email: 'alex.smith@example.com',
    phone: '+1 987 654 3210',
    avatar:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80',
    languages: 'English, Spanish, French',
    experience: 7, // years
    certifications: 'Wilderness First Aid, Mountain Guide Cert.',
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(guideData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'experience' ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    setGuideData(formData);
    setEditMode(false);
    alert('Profile updated!');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md max-h-screen overflow-y-auto">
      <div className="flex flex-col items-center space-y-6 mb-10">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-600">
          <img
            src={guideData.avatar}
            alt="Guide Avatar"
            className="object-cover w-full h-full"
          />
          {editMode && (
            <button
              className="absolute bottom-1 right-1 bg-indigo-700 hover:bg-indigo-800 text-white rounded-full p-1 shadow"
              title="Change Avatar"
              onClick={() => alert('Avatar change not implemented')}
            >
              <Edit2 className="w-5 h-5" />
            </button>
          )}
        </div>
        <h1 className="text-3xl font-extrabold text-indigo-700">{guideData.name}</h1>
        <button
          className="text-indigo-600 hover:underline text-sm"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        {/* Name */}
        <div>
          <label className="flex items-center gap-2 text-indigo-700 font-semibold mb-1" htmlFor="name">
            <User className="w-5 h-5" /> Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            disabled={!editMode}
            value={formData.name}
            onChange={handleChange}
            className={`w-full border rounded-md px-4 py-2 text-gray-800 ${
              editMode ? 'border-indigo-600 focus:ring-indigo-600 focus:ring-1' : 'bg-gray-100 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-indigo-700 font-semibold mb-1" htmlFor="email">
            <Mail className="w-5 h-5" /> Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            disabled={!editMode}
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded-md px-4 py-2 text-gray-800 ${
              editMode ? 'border-indigo-600 focus:ring-indigo-600 focus:ring-1' : 'bg-gray-100 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-indigo-700 font-semibold mb-1" htmlFor="phone">
            <Phone className="w-5 h-5" /> Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            disabled={!editMode}
            value={formData.phone}
            onChange={handleChange}
            className={`w-full border rounded-md px-4 py-2 text-gray-800 ${
              editMode ? 'border-indigo-600 focus:ring-indigo-600 focus:ring-1' : 'bg-gray-100 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Languages */}
        <div>
          <label className="flex items-center gap-2 text-indigo-700 font-semibold mb-1" htmlFor="languages">
            <Globe className="w-5 h-5" /> Languages Spoken
          </label>
          <input
            id="languages"
            name="languages"
            type="text"
            disabled={!editMode}
            value={formData.languages}
            onChange={handleChange}
            placeholder="e.g. English, Spanish, French"
            className={`w-full border rounded-md px-4 py-2 text-gray-800 ${
              editMode ? 'border-indigo-600 focus:ring-indigo-600 focus:ring-1' : 'bg-gray-100 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Experience */}
        <div>
          <label className="flex items-center gap-2 text-indigo-700 font-semibold mb-1" htmlFor="experience">
            <ClipboardList className="w-5 h-5" /> Experience (years)
          </label>
          <input
            id="experience"
            name="experience"
            type="number"
            min={0}
            disabled={!editMode}
            value={formData.experience}
            onChange={handleChange}
            className={`w-full border rounded-md px-4 py-2 text-gray-800 ${
              editMode ? 'border-indigo-600 focus:ring-indigo-600 focus:ring-1' : 'bg-gray-100 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Certifications */}
        <div>
          <label className="flex items-center gap-2 text-indigo-700 font-semibold mb-1" htmlFor="certifications">
            <Award className="w-5 h-5" /> Certifications
          </label>
          <textarea
            id="certifications"
            name="certifications"
            disabled={!editMode}
            value={formData.certifications}
            onChange={handleChange}
            rows={3}
            placeholder="List certifications separated by commas"
            className={`w-full border rounded-md px-4 py-2 text-gray-800 resize-y ${
              editMode ? 'border-indigo-600 focus:ring-indigo-600 focus:ring-1' : 'bg-gray-100 cursor-not-allowed'
            }`}
          />
        </div>

        {editMode && (
          <div className="flex justify-center">
            <Button type="submit" className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-3 rounded-xl">
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
