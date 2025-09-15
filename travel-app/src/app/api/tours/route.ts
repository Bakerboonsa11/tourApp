import { NextRequest,NextResponse } from 'next/server';
import {connectDB }from '../../../lib/db';
import TourModel from '@/model/tours';
import { createOne, getAll,createMany } from '../../../lib/factoryfun';


// app/api/tours/route.ts
// import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Description } from '@radix-ui/react-dialog';
// import { connectDB } from '@/lib/db';
// import TourModel from '@/model/tours';

export const config = {
  api: {
    bodyParser: false,
  },
};
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


export async function GET (req: NextRequest) {
  await connectDB();
  return getAll(TourModel)(req);
};




export async function POST(req: NextRequest) {
  await connectDB();

  const formData = await req.formData();

  console.log('Received form data:', formData);

  // Parse location JSON safely
  const locationJson = formData.get('location')?.toString() || '{}';
  let locationParsed;
  try {
    locationParsed = JSON.parse(locationJson);
  } catch {
    locationParsed = {};
  }
  const lng = parseFloat(locationParsed.coordinates?.[0]);
  const lat = parseFloat(locationParsed.coordinates?.[1]);
  
  const coords = [lng, lat] as [number, number];
  

  // Build location object
  const location: {
    type: "Point";
    coordinates: [number, number];
    address: string;
    description: string;
  } = {
    type: "Point",
    coordinates: coords,
    address: locationParsed.address || '',
    description: locationParsed.description || '',
  };
  
  
  // Validate coordinates
  if (
    location.coordinates.length !== 2 ||
    location.coordinates.some((coord: number) => isNaN(coord))
  ) {
    return NextResponse.json(
      { status: 'fail', message: 'Invalid location coordinates' },
      { status: 400 }
    );
  }

  // Extract files from form data
  const cover = formData.get('coverImage');
  const photos = formData.getAll('photos');

  // Prepare fields for new Tour
  const fields: TourFields = {
    name: formData.get('name')?.toString() || '',
    slug: formData.get('slug')?.toString() || '',
    description: formData.get('description')?.toString() || '',
    region: formData.get('region')?.toString() || '',
    typeOfTour: JSON.parse(formData.get('typeOfTour')?.toString() || '[]'),
    price: parseFloat(formData.get('price')?.toString() || '0'),
    duration: parseInt(formData.get('duration')?.toString() || '0'),
    maxGroupSize: parseInt(formData.get('maxGroupSize')?.toString() || '0'),
    difficulty: formData.get('difficulty')?.toString() || '',
    location,
    startDates: formData.get('startDates') ? [new Date(formData.get('startDates')!.toString())] : [],
    endDate: formData.get('endDate') ? new Date(formData.get('endDate')!.toString()) : null,
  };

  // Handle cover image upload
  if (
    cover &&
    typeof (cover as Blob).arrayBuffer === 'function'
  ) {
    const file = cover as Blob & { name: string };
    const buffer = Buffer.from(await file.arrayBuffer());
  
    const uploadDir = path.join(process.cwd(), '/public/toursphoto');
    fs.mkdirSync(uploadDir, { recursive: true });
  
    const filename = `cover-${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);
  
    await fs.promises.writeFile(filepath, buffer);
    fields.coverImage = filename;
  }
   else {
    // If no cover image, reject as it's required
    return NextResponse.json(
      { status: 'fail', message: 'Cover image is required' },
      { status: 400 }
    );
  }

  // Handle photos upload
  const photoPaths: string[] = [];
  type FileLike = Blob & { name: string; arrayBuffer: () => Promise<ArrayBuffer> };

  for (const p of photos) {
    if (p && typeof (p as FileLike).arrayBuffer === 'function') {
      const file = p as FileLike;
      const buffer = Buffer.from(await file.arrayBuffer());
  
      const filename = `photo-${Date.now()}-${file.name}`;
      const filepath = path.join(process.cwd(), '/public/toursphoto', filename);
  
      await fs.promises.writeFile(filepath, buffer);
      photoPaths.push(`${filename}`);
    }
  }
  

  if (photoPaths.length > 0) {
    fields.images = photoPaths;
  }

  try {
    const newTour = await TourModel.create(fields);
    return NextResponse.json({ status: 'success', data: newTour }, { status: 201 });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ status: 'fail', message }, { status: 500 });
  }
}

