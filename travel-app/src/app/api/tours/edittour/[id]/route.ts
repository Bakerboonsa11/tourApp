import { NextRequest,NextResponse } from 'next/server';
import {connectDB }from '../../../../../lib/db';
import TourModel from '@/model/tours';
// import { createOne, getAll,createMany } from '../../../lib/factoryfun';


// app/api/tours/route.ts
// import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Description } from '@radix-ui/react-dialog';
// import { connectDB } from '@/lib/db';
// import TourModel from '@/model/tours';
interface TourFields {
    name: string;
    slug: string;
    description: string;
    region: string;
    typeOfTour: string[];
    price: number;
    duration: number;
    maxGroupSize: number;
    difficulty: string;
    location: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
      address: string;
      description: string;
    };
  
    startDates: Date[];
    endDate: Date | null;
    
    coverImage?: string;
    images?: string[];
  }

  function cleanFields<T extends Record<string, any>>(obj: T): Partial<T> {
    const cleaned: Partial<T> = {};
  
    for (const key in obj) {
      const value = obj[key];
  
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      const isEmptyObject =
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0;
  
      const isZeroNumber = typeof value === 'number' && value === 0;
  
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !isEmptyArray &&
        !isEmptyObject &&
        !isZeroNumber
      ) {
        cleaned[key] = value;
      }
    }
  
    return cleaned;
  }
  
  


export async function PATCH  (req: NextRequest) {
  await connectDB();

  const formData = await req.formData();
  console.log('Received form data:', formData);
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ status: 'fail', message: 'Missing tour ID' }, { status: 400 });
  }

  // Parse location
  let locationParsed: any = {};
  try {
    locationParsed = JSON.parse(formData.get('location')?.toString() || '{}');
  } catch {
    return NextResponse.json({ status: 'fail', message: 'Invalid location format' }, { status: 400 });
  }

  const lng = parseFloat(locationParsed.coordinates?.[0]);
  const lat = parseFloat(locationParsed.coordinates?.[1]);

  if (isNaN(lng) || isNaN(lat)) {
    return NextResponse.json({ status: 'fail', message: 'Invalid location coordinates' }, { status: 400 });
  }

  const location: TourFields['location'] = {
    type: 'Point',
    coordinates: [lng, lat],
    address: locationParsed.address || '',
    description: locationParsed.description || '',
  };

  // Parse typeOfTour safely
  let typeOfTour: string[] = [];
  try {
    const raw = formData.get('typeOfTour')?.toString() || '[]';
    typeOfTour = JSON.parse(raw);
  } catch {
    return NextResponse.json({ status: 'fail', message: 'Invalid typeOfTour format' }, { status: 400 });
  }

  let startDates: Date[] = [];
  let endDate: Date | null = null;

try {
  const raw = formData.get('startDates')?.toString() || '[]';
  const parsed = JSON.parse(raw);
  startDates = parsed.map((d: string) => new Date(d)).filter((d: Date) => !isNaN(d.getTime()));
} catch (err) {
  return NextResponse.json({ status: 'fail', message: 'Invalid startDates format' }, { status: 400 });
}


const endDateRaw = formData.get('endDate')?.toString();
if (endDateRaw) {
  const parsed = new Date(endDateRaw);
  if (!isNaN(parsed.getTime())) {
    endDate = parsed;
  }
}



  const fields: Partial<TourFields> = {
    name: formData.get('name')?.toString() || '',
    slug: formData.get('slug')?.toString() || '',
    description: formData.get('description')?.toString() || '',
    region: formData.get('region')?.toString() || '',
    typeOfTour,
    price: parseFloat(formData.get('price')?.toString() || '0'),
    duration: parseInt(formData.get('duration')?.toString() || '0'),
    maxGroupSize: parseInt(formData.get('maxGroupSize')?.toString() || '0'),
    difficulty: formData.get('difficulty')?.toString() || '',
    location,
   startDates,
    endDate
  };

  // Upload cover image
  const cover = formData.get('coverImage');
  if (cover && typeof (cover as Blob).arrayBuffer === 'function') {
    const file = cover as Blob & { name: string };
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadDir = path.join(process.cwd(), '/public/toursphoto');
    fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `cover-${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    await fs.promises.writeFile(filepath, buffer);
    fields.coverImage = filename;
  }

  // Upload photos
  const photoPaths: string[] = [];
  const photos = formData.getAll('photos');
  
  for (const p of photos) {
    if (p && typeof (p as Blob).arrayBuffer === 'function') {
      const file = p as Blob & { name: string };
      const buffer = Buffer.from(await file.arrayBuffer());
  
      const filename = `photo-${Date.now()}-${file.name}`;
      const filepath = path.join(process.cwd(), '/public/toursphoto', filename);
  
      await fs.promises.writeFile(filepath, buffer);
      photoPaths.push(filename);
    }
  }
  

  // Merge with existing images if present
  const existingPhotos = formData.getAll('existingPhotos').map((p) => p.toString());
  const mergedPhotos = [...existingPhotos, ...photoPaths];
  if (mergedPhotos.length > 0) {
    fields.images = mergedPhotos;
  }

  // Update DB
  const cleanedFields = cleanFields(fields);
  try {
    const updatedTour = await TourModel.findByIdAndUpdate(id, cleanedFields, {
      new: true,
      runValidators: true,
    });


    if (!updatedTour) {
      return NextResponse.json({ status: 'fail', message: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'success', data: updatedTour }, { status: 200 });
  } catch (err) {
    console.error('Update error:', err);
    return NextResponse.json({ status: 'error', message: 'Failed to update tour' }, { status: 500 });
  }
};



