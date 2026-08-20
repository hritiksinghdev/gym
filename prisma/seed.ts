import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data
  await prisma.payment.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.client.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.gymSettings.deleteMany();

  // 1. Create Default Admin
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.create({
    data: {
      name: "Gym Head Coach",
      email: "admin@gym.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log("✓ Admin created:", admin.email);

  // 2. Create Gym Settings
  const settings = await prisma.gymSettings.create({
    data: {
      id: "default",
      gymName: "TITAN FORGE GYM",
      tagline: "BUILD YOUR STRONGEST SELF",
      heroHeadline: "BUILD YOUR STRONGEST SELF.",
      heroDescription:
        "Raw iron, high-performance coaching, and an uncompromising atmosphere engineered to sculpt peak human strength. No fluff, no excuses — pure discipline and results.",
      address: "Plot 42, Ironworks Industrial Estate, 2nd Cross, Near Central Metro Station, Bangalore 560001",
      phone: "+91 98765 43210",
      whatsappNumber: "919876543210",
      email: "contact@titanforgegym.com",
      openingHours: "Mon - Sat: 5:00 AM - 11:00 PM | Sun: 6:00 AM - 8:00 PM",
      googleMapsUrl: "https://maps.google.com/?q=Titan+Forge+Gym",
      instagramUrl: "https://instagram.com/titanforgegym",
      facebookUrl: "https://facebook.com/titanforgegym",
      youtubeUrl: "https://youtube.com/titanforgegym",
      currencySymbol: "₹",
      memberIdPrefix: "GYM",
    },
  });
  console.log("✓ Gym settings configured");

  // 3. Create Membership Plans
  const plansData = [
    {
      name: "Monthly",
      durationDays: 30,
      price: 1500,
      description: "Ideal for beginners or short-term training goals.",
      benefits: JSON.stringify([
        "Full gym & weights floor access",
        "Locker & shower facilities",
        "Free fitness assessment",
        "General trainer guidance",
      ]),
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "Quarterly",
      durationDays: 90,
      price: 4000,
      description: "Our most popular package for serious transformation.",
      benefits: JSON.stringify([
        "Full gym & cardio floor access",
        "Locker & shower facilities",
        "Personalized workout chart",
        "1 Free 1-on-1 PT session",
        "Nutrition & macro roadmap",
      ]),
      sortOrder: 2,
      isActive: true,
    },
    {
      name: "Half Yearly",
      durationDays: 180,
      price: 7000,
      description: "Committed lifters ready to pack on serious muscle and stamina.",
      benefits: JSON.stringify([
        "Unlimited access all zones",
        "2 Free 1-on-1 PT sessions",
        "InBody body composition tracking",
        "Priority locker access",
        "Custom diet & supplementation plan",
        "Free gym shaker & tee",
      ]),
      sortOrder: 3,
      isActive: true,
    },
    {
      name: "Yearly",
      durationDays: 365,
      price: 12000,
      description: "The ultimate athlete package. Best value for year-round supremacy.",
      benefits: JSON.stringify([
        "All-access 365 days VIP pass",
        "5 Free 1-on-1 PT sessions",
        "Monthly InBody body analysis",
        "Permanent dedicated locker",
        "Complete nutrition overhaul",
        "Free gym apparel bundle",
        "1 Month freeze option",
      ]),
      sortOrder: 4,
      isActive: true,
    },
  ];

  const plans = [];
  for (const p of plansData) {
    const plan = await prisma.membershipPlan.create({ data: p });
    plans.push(plan);
  }
  console.log(`✓ ${plans.length} Membership plans created`);

  // 4. Create Trainers
  const trainersData = [
    {
      name: "Vikram 'The Anvil' Rao",
      specialization: "Heavy Powerlifting & Strength Conditioning",
      experience: "9+ Years Experience",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      bio: "Former national powerlifter specializing in compound lift mechanics, progressive overload, and explosive strength.",
      phone: "+91 98800 11223",
      email: "vikram@titanforgegym.com",
      sortOrder: 1,
    },
    {
      name: "Aarav 'Iron' Sharma",
      specialization: "Hypertrophy & Competitive Bodybuilding",
      experience: "7+ Years Experience",
      photoUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&auto=format&fit=crop&q=80",
      bio: "Certified biomechanics coach helping athletes pack on lean mass, master muscle isolation, and peak for physique competitions.",
      phone: "+91 98800 22334",
      email: "aarav@titanforgegym.com",
      sortOrder: 2,
    },
    {
      name: "Pooja 'Valkyrie' Nair",
      specialization: "CrossFit, HIIT & Athletic Conditioning",
      experience: "6+ Years Experience",
      photoUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      bio: "Level-2 CrossFit coach focusing on metabolic conditioning, mobility, kettlebells, and endurance under pressure.",
      phone: "+91 98800 33445",
      email: "pooja@titanforgegym.com",
      sortOrder: 3,
    },
    {
      name: "Dev 'Kratos' Malhotra",
      specialization: "Fat Loss & Functional Mobility",
      experience: "5+ Years Experience",
      photoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      bio: "Specializes in rapid body recomposition, injury rehab, core stability, and athletic longevity for working professionals.",
      phone: "+91 98800 44556",
      email: "dev@titanforgegym.com",
      sortOrder: 4,
    },
  ];

  for (const t of trainersData) {
    await prisma.trainer.create({ data: t });
  }
  console.log(`✓ ${trainersData.length} Trainers created`);

  // 5. Create Clients with various Membership dates
  const today = new Date();
  
  const clientSeedData = [
    // 1. Expiring Soon (in 3 days)
    {
      memberId: "GYM-2026-0001",
      fullName: "Rohan Varma",
      phone: "9876501001",
      email: "rohan.varma@gmail.com",
      gender: "Male",
      address: "124 Indiranagar 100ft Road, Bangalore",
      emergencyContactName: "Kavita Varma",
      emergencyContactPhone: "9876509001",
      planIndex: 0, // Monthly
      startOffsetDays: -27,
      endOffsetDays: 3,
      paymentMethod: "UPI",
    },
    // 2. Expiring Soon (in 5 days)
    {
      memberId: "GYM-2026-0002",
      fullName: "Priya Sundaram",
      phone: "9876501002",
      email: "priya.sundaram@outlook.com",
      gender: "Female",
      address: "56 Koramangala 4th Block, Bangalore",
      emergencyContactName: "Rajesh Sundaram",
      emergencyContactPhone: "9876509002",
      planIndex: 1, // Quarterly
      startOffsetDays: -85,
      endOffsetDays: 5,
      paymentMethod: "CARD",
    },
    // 3. Expiring Soon (in 1 day)
    {
      memberId: "GYM-2026-0003",
      fullName: "Arjun Reddy",
      phone: "9876501003",
      email: "arjun.reddy@gmail.com",
      gender: "Male",
      address: "78 HSR Layout Sector 2, Bangalore",
      emergencyContactName: "Sunil Reddy",
      emergencyContactPhone: "9876509003",
      planIndex: 0, // Monthly
      startOffsetDays: -29,
      endOffsetDays: 1,
      paymentMethod: "UPI",
    },
    // 4. Expired (5 days ago)
    {
      memberId: "GYM-2026-0004",
      fullName: "Siddharth Sen",
      phone: "9876501004",
      email: "siddharth.sen@gmail.com",
      gender: "Male",
      address: "33 Whitefield Main Rd, Bangalore",
      emergencyContactName: "Meera Sen",
      emergencyContactPhone: "9876509004",
      planIndex: 0, // Monthly
      startOffsetDays: -35,
      endOffsetDays: -5,
      paymentMethod: "CASH",
    },
    // 5. Expired (15 days ago)
    {
      memberId: "GYM-2026-0005",
      fullName: "Ananya Iyer",
      phone: "9876501005",
      email: "ananya.iyer@yahoo.com",
      gender: "Female",
      address: "19 JP Nagar Phase 3, Bangalore",
      emergencyContactName: "Deepak Iyer",
      emergencyContactPhone: "9876509005",
      planIndex: 1, // Quarterly
      startOffsetDays: -105,
      endOffsetDays: -15,
      paymentMethod: "UPI",
    },
    // 6. Active (Just renewed, 80 days remaining)
    {
      memberId: "GYM-2026-0006",
      fullName: "Kabir Khan",
      phone: "9876501006",
      email: "kabir.khan@gmail.com",
      gender: "Male",
      address: "88 Benson Town, Bangalore",
      emergencyContactName: "Zoya Khan",
      emergencyContactPhone: "9876509006",
      planIndex: 1, // Quarterly
      startOffsetDays: -10,
      endOffsetDays: 80,
      paymentMethod: "CARD",
    },
    // 7. Active (Yearly, 250 days remaining)
    {
      memberId: "GYM-2026-0007",
      fullName: "Sameer Joshi",
      phone: "9876501007",
      email: "sameer.j@gmail.com",
      gender: "Male",
      address: "41 Malleshwaram 8th Main, Bangalore",
      emergencyContactName: "Asha Joshi",
      emergencyContactPhone: "9876509007",
      planIndex: 3, // Yearly
      startOffsetDays: -115,
      endOffsetDays: 250,
      paymentMethod: "BANK_TRANSFER",
    },
    // 8. Active (Half Yearly, 120 days remaining)
    {
      memberId: "GYM-2026-0008",
      fullName: "Divya Patel",
      phone: "9876501008",
      email: "divya.patel@gmail.com",
      gender: "Female",
      address: "92 Bellandur Outer Ring Road, Bangalore",
      emergencyContactName: "Bhavin Patel",
      emergencyContactPhone: "9876509008",
      planIndex: 2, // Half Yearly
      startOffsetDays: -60,
      endOffsetDays: 120,
      paymentMethod: "UPI",
    },
    // 9. Active (Joined Today!)
    {
      memberId: "GYM-2026-0009",
      fullName: "Rahul Menon",
      phone: "9876501009",
      email: "rahul.m@gmail.com",
      gender: "Male",
      address: "15 Domlur Layout, Bangalore",
      emergencyContactName: "Gita Menon",
      emergencyContactPhone: "9876509009",
      planIndex: 0, // Monthly
      startOffsetDays: 0,
      endOffsetDays: 30,
      paymentMethod: "UPI",
    },
    // 10. Active (Joined Today!)
    {
      memberId: "GYM-2026-0010",
      fullName: "Karan Oberoi",
      phone: "9876501010",
      email: "karan.oberoi@gmail.com",
      gender: "Male",
      address: "67 Sarjapur Road, Bangalore",
      emergencyContactName: "Simran Oberoi",
      emergencyContactPhone: "9876509010",
      planIndex: 1, // Quarterly
      startOffsetDays: 0,
      endOffsetDays: 90,
      paymentMethod: "CASH",
    },
    // 11. Active (Yearly VIP)
    {
      memberId: "GYM-2026-0011",
      fullName: "Tara Deshmukh",
      phone: "9876501011",
      email: "tara.deshmukh@gmail.com",
      gender: "Female",
      address: "14 Lavelle Road, Bangalore",
      emergencyContactName: "Vikram Deshmukh",
      emergencyContactPhone: "9876509011",
      planIndex: 3, // Yearly
      startOffsetDays: -30,
      endOffsetDays: 335,
      paymentMethod: "UPI",
    },
    // 12. Suspended
    {
      memberId: "GYM-2026-0012",
      fullName: "Manish Chawla",
      phone: "9876501012",
      email: "manish.c@gmail.com",
      gender: "Male",
      address: "52 BTM 2nd Stage, Bangalore",
      emergencyContactName: "Anita Chawla",
      emergencyContactPhone: "9876509012",
      planIndex: 1, // Quarterly
      startOffsetDays: -40,
      endOffsetDays: 50,
      status: "SUSPENDED",
      paymentMethod: "UPI",
    },
    // 13. Upcoming (starts in 3 days)
    {
      memberId: "GYM-2026-0013",
      fullName: "Neha Kapoor",
      phone: "9876501013",
      email: "neha.kapoor@gmail.com",
      gender: "Female",
      address: "71 Cunningham Road, Bangalore",
      emergencyContactName: "Amit Kapoor",
      emergencyContactPhone: "9876509013",
      planIndex: 2, // Half Yearly
      startOffsetDays: 3,
      endOffsetDays: 183,
      paymentMethod: "CARD",
    },
  ];

  for (const c of clientSeedData) {
    const client = await prisma.client.create({
      data: {
        memberId: c.memberId,
        fullName: c.fullName,
        phone: c.phone,
        email: c.email,
        gender: c.gender,
        address: c.address,
        emergencyContactName: c.emergencyContactName,
        emergencyContactPhone: c.emergencyContactPhone,
        status: c.status === "SUSPENDED" ? "SUSPENDED" : "ACTIVE",
      },
    });

    const plan = plans[c.planIndex];
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + c.startOffsetDays);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + c.endOffsetDays);

    const membership = await prisma.membership.create({
      data: {
        clientId: client.id,
        planId: plan.id,
        startDate: startDate,
        endDate: endDate,
        amount: plan.price,
        discount: 0,
        finalAmount: plan.price,
        paymentStatus: "PAID",
        status: c.status === "SUSPENDED" ? "SUSPENDED" : "ACTIVE",
      },
    });

    // Create payment
    const paymentDate = new Date(startDate);
    await prisma.payment.create({
      data: {
        clientId: client.id,
        membershipId: membership.id,
        amount: plan.price,
        paymentMethod: c.paymentMethod,
        paymentDate: paymentDate,
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        status: "COMPLETED",
        notes: `Payment for ${plan.name} plan via ${c.paymentMethod}`,
      },
    });
  }

  console.log(`✓ ${clientSeedData.length} Clients with Memberships & Payments seeded`);
  console.log("🚀 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
