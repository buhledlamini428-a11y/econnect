// Seeds default categories, an admin account, and premium pricing.
// Run with: npm run seed
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const categories = [
  // Jobs
  ...["Full-time", "Part-time", "Temporary", "Casual", "Contract", "Remote", "Local", "Apprenticeship", "Internship", "Volunteer"].map(
    (name) => ({ name, type: "JOB" })
  ),
  // Services
  ...[
    "Cleaning", "Gardening", "Plumbing", "Electrical", "Catering", "Hairdressing", "Beauty",
    "Repairs", "Driving", "Babysitting", "Care Work", "Tutoring", "Construction",
    "Photography", "Administration", "IT Services", "Other Services",
  ].map((name) => ({ name, type: "SERVICE" })),
  // Products
  ...[
    "Electronics", "Phones", "Clothing", "Furniture", "Vehicles", "Household Items",
    "Appliances", "Agriculture", "Construction Materials", "Beauty Products", "Children's Items", "Other",
  ].map((name) => ({ name, type: "PRODUCT" })),
  // Tasks share service-style categories plus a generic bucket
  ...["Gardening", "Cleaning", "Moving", "Delivery", "Painting", "Babysitting", "Event Assistance", "Computer Help", "Other Tasks"].map(
    (name) => ({ name, type: "TASK" })
  ),
  // Requests reuse a generic "I need..." bucket per broad category
  ...["Service Needed", "Item Needed", "Worker Needed", "Other Request"].map((name) => ({ name, type: "REQUEST" })),
];

async function main() {
  console.log("Seeding categories...");
  for (const c of categories) {
    await prisma.category.upsert({
      where: { name_type: { name: c.name, type: c.type } },
      update: {},
      create: c,
    });
  }

  console.log("Seeding premium pricing...");
  const pricing = [
    { key: "price_verified_badge_monthly", value: "200" },
    { key: "price_featured_listing", value: "50" },
    { key: "price_boost_listing", value: "50" },
    { key: "price_priority_placement", value: "75" },
    { key: "price_business_profile", value: "150" },
  ];
  for (const p of pricing) {
    await prisma.adminSetting.upsert({ where: { key: p.key }, update: { value: p.value }, create: p });
  }

  console.log("Seeding admin account...");
  const adminEmail = process.env.ADMIN_EMAIL || "admin@econnect.co.sz";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const adminPhone = process.env.ADMIN_PHONE || "+26876000000";
  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      fullName: "E-connect Admin",
      username: "econnect_admin",
      email: adminEmail,
      phone: adminPhone,
      password: hashed,
      role: "admin",
      status: "active",
      isPhoneVerified: true,
      isEmailVerified: true,
      trustScore: 100,
    },
  });

  console.log("Seed complete. Admin login:", adminEmail, "/ password from .env");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });