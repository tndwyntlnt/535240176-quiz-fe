// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const items = await prisma.item.findMany({
//       orderBy: { createdAt: "desc" },
//     });
//     return NextResponse.json(items);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, image } = body;

//     if (!name) {
//       return NextResponse.json({ error: "Name is required" }, { status: 400 });
//     }

//     const item = await prisma.item.create({
//       data: {
//         name,
//         image: image ?? null,
//       },
//     });

//     return NextResponse.json(item, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
//   }
// }

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, image } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const item = await prisma.item.create({
      data: {
        name,
        image: image ?? null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
