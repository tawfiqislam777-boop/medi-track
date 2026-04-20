import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validatePatient, sanitizeString } from "@/lib/validations";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patient = await prisma.patient.findUnique({ where: { id: params.id } });
    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    return NextResponse.json(patient);
  } catch (error) {
    console.error("[GET /api/patients/:id]", error);
    return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const errors = validatePatient(body);
    if (errors.length > 0) return NextResponse.json({ errors }, { status: 422 });

    const existing = await prisma.patient.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    // Check email uniqueness (excluding current patient)
    const emailConflict = await prisma.patient.findFirst({
      where: { email: body.email.toLowerCase(), NOT: { id: params.id } },
    });
    if (emailConflict) {
      return NextResponse.json(
        { errors: [{ field: "email", message: "A patient with this email already exists" }] },
        { status: 409 }
      );
    }

    const patient = await prisma.patient.update({
      where: { id: params.id },
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

    return NextResponse.json(patient);
  } catch (error) {
    console.error("[PUT /api/patients/:id]", error);
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const existing = await prisma.patient.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    await prisma.patient.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/patients/:id]", error);
    return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 });
  }
}
