// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = Number(params.id);
//     const item = await prisma.item.findUnique({
//       where: { id },
//     });

//     if (!item) {
//       return NextResponse.json({ error: "Item not found" }, { status: 404 });
//     }

//     return NextResponse.json(item);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
//   }
// }

// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = Number(params.id);
//     const body = await req.json();
//     const { name, image } = body;

//     if (!name) {
//       return NextResponse.json({ error: "Name is required" }, { status: 400 });
//     }

//     const item = await prisma.item.update({
//       where: { id },
//       data: {
//         name,
//         image: image ?? null,
//       },
//     });

//     return NextResponse.json(item);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
//   }
// }

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = Number(params.id);
//     await prisma.item.delete({
//       where: { id },
//     });

//     return NextResponse.json({ ok: true });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
//   }
// }


import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const item = await prisma.item.findUnique({
      where: { id: Number(id) },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, image } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const item = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        name,
        image: image ?? null,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    await prisma.item.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
