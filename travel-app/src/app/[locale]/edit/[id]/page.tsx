'use client';
import React, { useState, ChangeEvent } from 'react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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
export interface ITour {
  _id: string;
  status: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  typeOfTour: string[]; // assuming it's an array of categories like ['nature', 'cave', 'hiking']
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'difficult';
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[]; // array of image filenames or URLs
  coverImage: string;
  location: {
    type?: string;
    coordinates?: number[];
    description?: string;
    address?: string;
  };
  startDates: string[]; // ISO date strings
  endDate: string; // ISO date string
  likes: string[]; // array of user IDs or emails
  comments: Comment[]; // you can define Comment type separately
  createdAt: string; // ISO date string
  guides: string[]; // array of guide user IDs
}

export default function Formedit() {
  const params = useParams();
  const id = params?.id;
  const [currentour, setCurrentTour] = useState<ITour | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


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
   

  
    useEffect(() => {
      const fetchTours = async () => {
        setLoading(true);
        try {
          console.log("Fetching tour with ID:", id);
          const res = await axios.get(`/api/tours/${id}`);
          const fetchedTour: ITour = res.data.data;
          setCurrentTour(fetchedTour);
          
          console.log("current tour is vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv ",fetchedTour)
          // setFilteredTours(fetchedTours);
        } catch (err) {
          console.error('Error fetching tours:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTours();
      
    }, []);



  const handleFieldChange = (field: keyof EditFields, value: unknown) => {
    setEditFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
  
    // Merge existing and new typeOfTour
    const mergedTypeOfTour = [
      ...(currentour?.typeOfTour || []),
      ...(editFields.typeOfTour || []),
    ];
  
    // Merge existing and new startDates
    const mergedStartDates = [
      ...(currentour?.startDates || []),
      ...(editFields.startDates || []),
    ];
  
    // Merge existing and new photos
    const mergedPhotos = [
      ...(currentour?.images || []), // existing photo URLs (strings)
    ];
  
    // Attach basic fields
    formData.append('name', editFields.name);
    formData.append('slug', editFields.slug);
    formData.append('description', editFields.description);
    formData.append('region', editFields.region);
    formData.append('typeOfTour', JSON.stringify(mergedTypeOfTour));
    formData.append('price', String(editFields.price));
    formData.append('duration', String(editFields.duration));
    formData.append('maxGroupSize', String(editFields.maxGroupSize));
    formData.append('difficulty', editFields.difficulty);
    formData.append('startDates', JSON.stringify(mergedStartDates));
    formData.append('endDate', editFields.endDate);
    formData.append('location', JSON.stringify(editFields.location));
  
    // Cover image (optional, overrides existing)
    if (editFields.coverImage) {
      formData.append('coverImage', editFields.coverImage);
    }
  
    // New photos (files)
    for (const photo of editFields.photos) {
      formData.append('photos', photo);
    }
  
    // Existing photos (URLs)
    for (const url of mergedPhotos) {
      formData.append('existingPhotos', url); // handle this key on backend
    }
  
    console.log('Form data prepared:', formData);
  
    try {
      const res = await fetch(`/api/tours/edittour/${currentour?._id}`, {
        method: 'PATCH',
        body: formData,
      });
    
      const result = await res.json();
    
      if (res.ok) {
        alert('Tour updated successfully!');
        router.back();
      } else {
        alert(result.message || 'Failed to update the tour.');
      }
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

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-200 mt-10">
      <h2 className="text-2xl font-bold text-blue-800 mb-6"> Update A Tour </h2>
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
          label="Price (ETB)"
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
          label="Longitude"
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
          label="Latitude"
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
          label="Location Description"
          value={editFields.location.description}
          onChange={(val) =>
            handleFieldChange('location', {
              ...editFields.location,
              description: val,
            })
          }
        />

        <InputBlock
          label="Address"
          value={editFields.location.address}
          onChange={(val) =>
            handleFieldChange('location', {
              ...editFields.location,
              address: val,
            })
          }
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
