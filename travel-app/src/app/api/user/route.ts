import { NextRequest } from 'next/server';
import {connectDB }from './../../../lib/db';
import UserModel from '@/model/user';
import { createOne, getAll } from '../../../lib/factoryfun';

export const GET = async (req: NextRequest) => {
  await connectDB();
  return getAll(UserModel)(req);
};

export const POST = async (req: NextRequest) => {
  await connectDB();
  return createOne(UserModel)(req);
};
