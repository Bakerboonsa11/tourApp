import { connectDB } from "./../../../lib/db";
import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
  name: String,
  price: Number,
});
const Tour = mongoose.models.Tour || mongoose.model("Tour", tourSchema);

export async function GET() {
  await connectDB();
  const tours = await Tour.find();
  return Response.json({ tours });
}

export async function POST(request: Request) {
  await connectDB();
  const data = await request.json();
  const newTour = await Tour.create(data);
  return Response.json(newTour);
}
