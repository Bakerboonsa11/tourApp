'use client';
import React, { useState, ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';

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
 
  coverImage: File | null;
  photos: File[];
  startDates: string;
  endDate: string;
 
  location: {
    coordinates: [number, number];
    address: string;
    description: string;
  };
  
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
   
    coverImage: null,
    photos: [],
    startDates: '',
    endDate: '',

    location: {
      coordinates: [0, 0],
      address: '',
      description: '',
    },
    
  });

  const [isediting, setIsEditing] = useState(false);
  const t = useTranslations('admin');

  const handleFieldChange = (field: keyof EditFields, value: unknown) => {
    setEditFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
  
    formData.append('name', editFields.name);
    formData.append('slug', editFields.slug);
    formData.append('description', editFields.description);
    formData.append('region', editFields.region);
    formData.append('typeOfTour', JSON.stringify(editFields.typeOfTour)); // array
    formData.append('price', String(editFields.price));
    formData.append('duration', String(editFields.duration));
    formData.append('maxGroupSize', String(editFields.maxGroupSize));
    formData.append('difficulty', editFields.difficulty);
   
    formData.append('startDates', editFields.startDates);
    formData.append('endDate', editFields.endDate);
    formData.append('location', JSON.stringify(editFields.location));

  
    if (editFields.coverImage) {
      formData.append('coverImage', editFields.coverImage);
    }
  
    for (const photo of editFields.photos) {
      formData.append('photos', photo);
    }
   console.log('Form data prepared:', formData);
    try {
      const res = await fetch('/api/tours', {
        method: 'POST',
        body: formData,
      });
  
      const result = await res.json();
      console.log('Result:', result);
    } catch (err) {
      console.error('Upload failed', err);
    }
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
   
      coverImage: null,
      photos: [],
      startDates: '',
      endDate: '',
  
      location: {
        coordinates: [0, 0],
        address: '',
        description: '',
      },
    });
  };

  return  (

    
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-200 mt-10">
      <h2 className="text-2xl font-bold text-blue-800 mb-6"> {t('form.title')} </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text inputs */}
        <InputBlock label={t('form.labels.name')} value={editFields.name} onChange={(val) => handleFieldChange('name', val)} />
        <InputBlock label={t('form.labels.slug')} value={editFields.slug} onChange={(val) => handleFieldChange('slug', val)} />

        <div className="md:col-span-2">
          <Label label={t('form.labels.description')} />
          <textarea
            rows={4}
            placeholder="Tour description"
            value={editFields.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <InputBlock label={t('form.labels.region')} value={editFields.region} onChange={(val) => handleFieldChange('region', val)} />

        <InputBlock
          label={t('form.labels.typeOfTour')}
          value={editFields.typeOfTour.join(', ')}
          onChange={(val) => handleFieldChange('typeOfTour', val.split(',').map((s) => s.trim()))}
          placeholder="e.g., adventure, forest, mountain"
        />

        <InputBlock
          label={t('form.labels.price')}
          type="number"
          value={editFields.price}
          onChange={(val) => handleFieldChange('price', parseFloat(val))}
        />

        <InputBlock
          label={t('form.labels.duration')}
          type="number"
          value={editFields.duration}
          onChange={(val) => handleFieldChange('duration', parseInt(val))}
        />
        <InputBlock
          label={t('form.labels.longitude')}
          type="number"
          value={editFields.location.coordinates[0]}
          onChange={(val) =>
            handleFieldChange('location', {
              ...editFields.location,
              coordinates: [parseFloat(val), editFields.location.coordinates[1]],
            })
          }
        />

        <InputBlock
          label={t('form.labels.latitude')}
          type="number"
          value={editFields.location.coordinates[1]}
          onChange={(val) =>
            handleFieldChange('location', {
              ...editFields.location,
              coordinates: [editFields.location.coordinates[0], parseFloat(val)],
            })
          }
        />

        <InputBlock
          label={t('form.labels.locationDescription')}
          value={editFields.location.description}
          onChange={(val) =>
            handleFieldChange('location', {
              ...editFields.location,
              description: val,
            })
          }
        />

        <InputBlock
          label={t('form.labels.address')}
          value={editFields.location.address}
          onChange={(val) =>
            handleFieldChange('location', {
              ...editFields.location,
              address: val,
            })
          }
        />


        <InputBlock
          label={t('form.labels.maxGroupSize')}
          type="number"
          value={editFields.maxGroupSize}
          onChange={(val) => handleFieldChange('maxGroupSize', parseInt(val))}
        />

        <div>
          <Label label={t('form.labels.difficulty')} />
          <select
            value={editFields.difficulty}
            onChange={(e) => handleFieldChange('difficulty', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">{t('form.options.selectDifficulty')}</option>
            <option value="easy">{t('form.options.easy')}</option>
            <option value="medium">{t('form.options.medium')}</option>
            <option value="difficult">{t('form.options.difficult')}</option>
          </select>
        </div>

      

        {/* File inputs */}
        <div>
          <Label label={t('form.labels.coverImage')} />
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
          <Label label={t('form.labels.photos')} />
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
          label={t('form.labels.startDate')}
          type="date"
          value={editFields.startDates}
          onChange={(val) => handleFieldChange('startDates', val)}
        />

        <InputBlock
          label={t('form.labels.endDate')}
          type="date"
          value={editFields.endDate}
          onChange={(val) => handleFieldChange('endDate', val)}
        />

        
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={handleCancelEdit}
          className="px-6 py-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
        >
        {t('form.buttons.cancel')}
        </button>
        <button
          type="button"
          onClick={handleSaveEdit}
          className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
 {t('form.buttons.saveChanges')}        </button>
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
