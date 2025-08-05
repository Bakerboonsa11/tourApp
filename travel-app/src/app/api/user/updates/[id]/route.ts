import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { connectDB } from '@/lib/db';
import UserModel from '@/model/user'; // ⬅️ Assuming you have a User model

interface UserFields {
  name: string;
  email: string;
  password: string;
  image?: string;
  location: string;
  phoneNumber: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
}

function cleanFields<T extends Record<string, unknown>>(obj: T): Partial<T> {
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

export async function PATCH(req: NextRequest) {
  await connectDB();
  console.log("entered successfully")
  const formData = await req.formData();
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ status: 'fail', message: 'Missing user ID' }, { status: 400 });
  }
  const socialMediaRaw = formData.get('socialMedia');
  let socialMediaParsed: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  } | undefined = undefined;
  
  if (socialMediaRaw) {
    try {
      const parsed = JSON.parse(socialMediaRaw.toString());
      // optionally validate keys
      if (
        typeof parsed.facebook === 'string' &&
        typeof parsed.twitter === 'string' &&
        typeof parsed.instagram === 'string' &&
        typeof parsed.linkedin === 'string'
      ) {
        socialMediaParsed = parsed;
      } else {
        console.warn('Parsed social media object does not match expected structure.');
      }
    } catch (e) {
      console.error('Failed to parse socialMedia JSON');
    }
  }
  
  const fields: Partial<UserFields> = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    password: formData.get('password')?.toString() || '',
    location: formData.get('location')?.toString() || '',
    phoneNumber: formData.get('phoneNumber')?.toString() || '',
    socialMedia: socialMediaParsed, // ✅ correctly typed
  };
  

  // Handle uploaded image
  const image = formData.get('image');
  if (image && typeof (image as Blob).arrayBuffer === 'function') {
    const file = image as Blob & { name: string };
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadDir = path.join(process.cwd(), '/public/userimages');
    fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `user-${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    await fs.promises.writeFile(filepath, buffer);
    fields.image = filename; // Save only filename or relative path
  }

  const cleanedFields = cleanFields(fields);

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(id, cleanedFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ status: 'fail', message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'success', data: updatedUser }, { status: 200 });
  } catch (err) {
    console.error('Update error:', err);
    return NextResponse.json({ status: 'error', message: 'Failed to update user' }, { status: 500 });
  }
}
