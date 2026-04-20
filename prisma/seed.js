const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

const patients = [
  { id: uuidv4(), name: "Alice Johnson", email: "alice.johnson@email.com", phone: "+1-555-0101", age: 34, condition: "Hypertension", status: "Active", notes: "Regular check-ups every 3 months" },
  { id: uuidv4(), name: "Bob Martinez", email: "bob.martinez@email.com", phone: "+1-555-0102", age: 52, condition: "Diabetes Type 2", status: "Active", notes: "On insulin therapy" },
  { id: uuidv4(), name: "Carol White", email: "carol.white@email.com", phone: "+1-555-0103", age: 28, condition: "Asthma", status: "Active", notes: "Carries emergency inhaler" },
  { id: uuidv4(), name: "David Brown", email: "david.brown@email.com", phone: "+1-555-0104", age: 67, condition: "Arthritis", status: "Active", notes: "Physical therapy recommended" },
  { id: uuidv4(), name: "Emma Davis", email: "emma.davis@email.com", phone: "+1-555-0105", age: 45, condition: "Migraine", status: "Active", notes: "Trigger: stress and bright lights" },
  { id: uuidv4(), name: "Frank Wilson", email: "frank.wilson@email.com", phone: "+1-555-0106", age: 38, condition: "Anxiety", status: "Active", notes: "CBT sessions ongoing" },
  { id: uuidv4(), name: "Grace Lee", email: "grace.lee@email.com", phone: "+1-555-0107", age: 55, condition: "Hypertension", status: "Inactive", notes: "Medication adjusted last visit" },
  { id: uuidv4(), name: "Henry Taylor", email: "henry.taylor@email.com", phone: "+1-555-0108", age: 41, condition: "Diabetes Type 1", status: "Active", notes: "Continuous glucose monitor" },
  { id: uuidv4(), name: "Isabella Anderson", email: "isabella.a@email.com", phone: "+1-555-0109", age: 29, condition: "Depression", status: "Active", notes: "Weekly counseling sessions" },
  { id: uuidv4(), name: "James Thomas", email: "james.thomas@email.com", phone: "+1-555-0110", age: 63, condition: "Heart Disease", status: "Critical", notes: "Post-surgery follow-up required" },
];

async function main() {
  console.log("🌱 Seeding database...");
  for (const patient of patients) {
    await prisma.patient.upsert({
      where: { email: patient.email },
      update: {},
      create: patient,
    });
  }
  console.log(`✅ Seeded ${patients.length} patients successfully`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
