// app/api/users/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/app/models/user.model";

/**
 * GET    /api/users
 * GET    /api/users?id=<id>
 * POST   /api/users
 * PUT    /api/users
 * DELETE /api/users
 */

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const user = await User.findById(id).lean();
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    const users = await User.find().sort({ name: 1 }).lean();
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body?.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.create({
      email: body.email.trim().toLowerCase(),
      name: body.name?.trim() || "",
      role: body.role || "user",
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, fields } = body;

    if (!userId || !fields) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, fields, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PUT /api/users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
