import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  ["Aarav Sharma", "aarav.sharma@example.com", 28],
  ["Mia Johnson", "mia.johnson@example.com", 31],
  ["Noah Williams", "noah.williams@example.com", 24],
  ["Isha Patel", "isha.patel@example.com", 29],
  ["Oliver Brown", "oliver.brown@example.com", 35],
  ["Sofia Garcia", "sofia.garcia@example.com", 27],
  ["Liam Davis", "liam.davis@example.com", 41],
  ["Ananya Mehta", "ananya.mehta@example.com", 26],
  ["Ethan Wilson", "ethan.wilson@example.com", 33],
  ["Emma Martinez", "emma.martinez@example.com", 30],
  ["Kabir Singh", "kabir.singh@example.com", 22],
  ["Ava Anderson", "ava.anderson@example.com", 38],
  ["Lucas Thomas", "lucas.thomas@example.com", 25],
  ["Diya Kapoor", "diya.kapoor@example.com", 32],
  ["James Taylor", "james.taylor@example.com", 45],
  ["Zoya Khan", "zoya.khan@example.com", 23],
  ["Benjamin Moore", "benjamin.moore@example.com", 37],
  ["Emily Jackson", "emily.jackson@example.com", 28],
  ["Rohan Verma", "rohan.verma@example.com", 34],
  ["Isabella White", "isabella.white@example.com", 26],
];

for (const [name, email, age] of users) {
  await prisma.user.upsert({
    where: { email },
    update: { name, age, status: 1 },
    create: { name, email, age, status: 1 },
  });
}

console.log(`Seeded ${users.length} users.`);
await prisma.$disconnect();
