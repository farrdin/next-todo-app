import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/connectDB";

export async function GET(request) {
  const email = request.headers.get("email");
  try {
    const db = await connectDB();
    const collection = db.collection("todos");

    const todos = await collection.find({ email }).toArray();
    return NextResponse.json(todos);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { text, email } = await request.json();
  try {
    const db = await connectDB();
    const collection = db.collection("todos");

    const newTodo = { text, email, createdAt: new Date() };
    const result = await collection.insertOne(newTodo);
    return NextResponse.json(
      { message: "Todo added", todo: { _id: result.insertedId, ...newTodo } },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to add todo" }, { status: 500 });
  }
}

export async function PUT(request) {
  const { id, text } = await request.json();
  try {
    const db = await connectDB();
    const collection = db.collection("todos");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { text } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "No todo found or text is the same" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Todo updated" }, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const { id } = await request.json();
  try {
    const db = await connectDB();
    const collection = db.collection("todos");

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "No todo found with that ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Todo deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
