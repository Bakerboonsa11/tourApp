'use client';
import React, { useState, ChangeEvent } from 'react';

interface EditFields {
  name: string;
  slug: string;
  description: string;
  region: string;
  typeOfTour: string[];
  price: number | string;
  duration: number | string;
  maxGroupSize: number | string;
  difficulty: string;
  ratingsAverage: number | string;
  ratingsQuantity: number | string;
  coverImage: File | null;
  photos: File[];
  startDates: string;
  endDate: string;
  createdAt: string;
  __v: number;
}

interface InputBlockProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
}

interface LabelProps {
  label: string;
}

export default function Form() {
  const [editFields, setEditFields] = useState<EditFields>({
    name: '',
    slug: '',
    description: '',
    region: '',
    typeOfTour: [],
    price: '',
    duration: '',
    maxGroupSize: '',
    difficulty: '',
    ratingsAverage: '',
    ratingsQuantity: '',
    coverImage: null,
    photos: [],
    startDates: '',
    endDate: '',
    createdAt: '',
    __v: 0,
  });

  const handleFieldChange = (field: keyof EditFields, value: unknown) => {
    setEditFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = () => {
    console.log('Saving:', editFields);
    // TODO: Implement actual save logic, e.g. API call with FormData for files
  };

  const handleCancelEdit = () => {
    setEditFields({
      name: '',
      slug: '',
      description: '',
      region: '',
      typeOfTour: [],
      price: '',
      duration: '',
      maxGroupSize: '',
      difficulty: '',
      ratingsAverage: '',
      ratingsQuantity: '',
      coverImage: null,
      photos: [],
      startDates: '',
      endDate: '',
      createdAt: '',
      __v: 0,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-200 mt-10">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Edit Tour Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text inputs */}
        <InputBlock label="Name" value={editFields.name} onChange={(val) => handleFieldChange('name', val)} />
        <InputBlock label="Slug" value={editFields.slug} onChange={(val) => handleFieldChange('slug', val)} />

        <div className="md:col-span-2">
          <Label label="Description" />
          <textarea
            rows={4}
            placeholder="Tour description"
            value={editFields.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <InputBlock label="Region" value={editFields.region} onChange={(val) => handleFieldChange('region', val)} />

        <InputBlock
          label="Type of Tour"
          value={editFields.typeOfTour.join(', ')}
          onChange={(val) => handleFieldChange('typeOfTour', val.split(',').map((s) => s.trim()))}
          placeholder="e.g., adventure, forest, mountain"
        />

        <InputBlock
          label="Price ($)"
          type="number"
          value={editFields.price}
          onChange={(val) => handleFieldChange('price', parseFloat(val))}
        />

        <InputBlock
          label="Duration (days)"
          type="number"
          value={editFields.duration}
          onChange={(val) => handleFieldChange('duration', parseInt(val))}
        />

        <InputBlock
          label="Max Group Size"
          type="number"
          value={editFields.maxGroupSize}
          onChange={(val) => handleFieldChange('maxGroupSize', parseInt(val))}
        />

        <div>
          <Label label="Difficulty" />
          <select
            value={editFields.difficulty}
            onChange={(e) => handleFieldChange('difficulty', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="difficult">Difficult</option>
          </select>
        </div>

        <InputBlock
          label="Ratings Average"
          type="number"
          value={editFields.ratingsAverage}
          onChange={(val) => handleFieldChange('ratingsAverage', parseFloat(val))}
        />

        <InputBlock
          label="Ratings Quantity"
          type="number"
          value={editFields.ratingsQuantity}
          onChange={(val) => handleFieldChange('ratingsQuantity', parseInt(val))}
        />

        {/* File inputs */}
        <div>
          <Label label="Cover Image" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              handleFieldChange('coverImage', file);
            }}
            className="w-full border border-gray-300 rounded-xl px-4 py-2"
          />
          {editFields.coverImage && (
            <p className="mt-2 text-sm text-gray-600">{editFields.coverImage.name}</p>
          )}
        </div>

        <div>
          <Label label="Photos (Multiple)" />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              handleFieldChange('photos', files);
            }}
            className="w-full border border-gray-300 rounded-xl px-4 py-2"
          />
          {editFields.photos.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside max-h-32 overflow-y-auto">
              {editFields.photos.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <InputBlock
          label="Start Date"
          type="date"
          value={editFields.startDates}
          onChange={(val) => handleFieldChange('startDates', val)}
        />

        <InputBlock
          label="End Date"
          type="date"
          value={editFields.endDate}
          onChange={(val) => handleFieldChange('endDate', val)}
        />

        <InputBlock
          label="Created At"
          type="datetime-local"
          value={editFields.createdAt}
          onChange={(val) => handleFieldChange('createdAt', val)}
        />
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={handleCancelEdit}
          className="px-6 py-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveEdit}
          className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// InputBlock Component
function InputBlock({ label, type = 'text', value, onChange, placeholder = '' }: InputBlockProps) {
  return (
    <div>
      <Label label={label} />
      <input
        type={type}
        placeholder={placeholder || label}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

// Label Component
function Label({ label }: LabelProps) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>;
}
