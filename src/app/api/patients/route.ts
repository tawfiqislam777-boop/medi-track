import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validatePatient, sanitizeString } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const condition = searchParams.get("condition") || "";
    const status = searchParams.get("status") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    if (condition && condition !== "All") where.condition = condition;
    if (status && status !== "All") where.status = status;

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.patient.count({ where }),
    ]);

    return NextResponse.json({
      patients,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[GET /api/patients]", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors = validatePatient(body);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const existing = await prisma.patient.findUnique({ where: { email: body.email.toLowerCase() } });
    if (existing) {
      return NextResponse.json(
        { errors: [{ field: "email", message: "A patient with this email already exists" }] },
        { status: 409 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        name: sanitizeString(body.name),
        email: body.email.toLowerCase().trim(),
        phone: sanitizeString(body.phone),
        age: parseInt(body.age),
        condition: sanitizeString(body.condition),
        notes: body.notes ? sanitizeString(body.notes) : null,
        status: body.status || "Active",
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error("[POST /api/patients]", error);
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
