// lib/controllers/genericHandlers.ts (Next.js App Router Version)

import mongoose, { Model, Document } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import AppFeatures from '../lib/appFeatures';

// CREATE ONE
export const createOne = <T extends Document>(Model: Model<T>) =>
  async (req: NextRequest) => {
    try {
      const body = await req.json();
      console.log("Request body:", body);
      const createdInstance = await Model.create(body);
      console.log("Created Instance:", createdInstance);
      return NextResponse.json({
        status: "success",
        message: "Data created successfully",
        data: createdInstance,
      }, { status: 201 });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return NextResponse.json({ status: "fail", message: errorMessage }, { status: 500 });
    }
  };

// DELETE ONE
export const deleteOne = <T extends Document>(Model: Model<T>) =>
    async (_req: NextRequest, params: { id: string }) => {
      try {
        const { id } = params;
        const deletedInstance = await Model.findByIdAndDelete(id);
  
        if (!deletedInstance) {
          return NextResponse.json({ status: "fail", message: "No document found with this ID" }, { status: 404 });
        }
  
        const deletedName = 'name' in deletedInstance ? (deletedInstance as { name: string }).name : undefined;
  
        return NextResponse.json({
          status: "success",
          data: null,
          userdeletedis: deletedName,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ status: "fail", message }, { status: 500 });
      }
    };
  

// UPDATE ONE
export const updateOne = <T extends Document>(Model: Model<T>) =>
  async (req: NextRequest, params: { id: string }) => {
    try {
      console.log("Update request received");
      const body = await req.json();
      const { id } = params;

      console.log("Request body:", body);
      console.log("id for update:", id);

      const comment = body.comments?.[0];

      if (!comment) {
        return NextResponse.json({ status: "fail", message: "No comment data provided" }, { status: 400 });
      }

      // Ensure userId is cast to ObjectId

      const updatedInstance = await Model.updateOne(
        { _id: id },
        {
          $push: {
            comments: {
              message: comment.message,
              userId: comment.userId, // ✅ use string directly
              userImage: comment.userImage,
              name: comment.name,
              createdAt: new Date(),
            },
          },
        }
      );
      

      if (!updatedInstance) {
        return NextResponse.json({ status: "fail", message: "No document found to update" }, { status: 404 });
      }

      return NextResponse.json({ status: "success", updatedTo: updatedInstance });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error("Update error:", errorMessage);
      return NextResponse.json({ status: "fail", message: errorMessage }, { status: 500 });
    }
  };



// GET ONE


export const getOne = <T extends Document>(
  Model: Model<T>,
  req: NextRequest,
  context: { params: { id: string } }
) => {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ message: 'No ID provided' }, { status: 400 });
  }

  return new Promise(async (resolve) => {
    try {
      let doc;
      if (mongoose.Types.ObjectId.isValid(id)) {
        doc = await Model.findById(id);
      } else {
        doc = await Model.findOne({ email: id });
      }

      if (!doc) {
        return resolve(NextResponse.json({ message: 'No document found' }, { status: 404 }));
      }

      return resolve(NextResponse.json({ status: 'success', data: doc }, { status: 200 }));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return resolve(NextResponse.json({ message: errorMessage }, { status: 500 }));
    }
  });
};





// GET ALL
export const getAll = <T extends Document>(Model: Model<T>) =>
  async (req: NextRequest) => {
    try {
      const url = new URL(req.url);
      const queryParams = Object.fromEntries(url.searchParams.entries());
      console.log("getone is alerted")
      const features = new AppFeatures(Model.find(), queryParams)
        .filter()
        .sort()
        .fields();
        // .pagination(); Uncomment if pagination needed

      const instanceFiltered = await features.databaseQuery;
      console.log("Filtered Instances:", instanceFiltered);
      return NextResponse.json({
        status: "success",
        length: instanceFiltered.length,
        instanceFiltered,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return NextResponse.json({ status: "fail", message: errorMessage }, { status: 500 });
    }
  };

// CREATE MANY
export const createMany = <T extends Document>(Model: Model<T>) =>
  async (req: NextRequest) => {
    try {
      const body = await req.json();
      console.log("Request body:", body);

      if (!Array.isArray(body) || body.length === 0) {
        return NextResponse.json({ status: "fail", message: "Request body must be a non-empty array of documents" }, { status: 400 });
      }

      const createdInstances = await Model.insertMany(body, { ordered: true });

      return NextResponse.json({
        status: "success",
        message: "Documents created successfully",
        count: createdInstances.length,
        data: createdInstances,
      }, { status: 201 });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return NextResponse.json({ status: "fail", message: errorMessage }, { status: 500 });
    }
  };
