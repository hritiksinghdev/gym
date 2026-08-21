import prisma from "../src/lib/prisma";
import { createSessionToken } from "../src/lib/auth";

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING COMPREHENSIVE BACKEND & DATABASE TESTS");
  console.log("==================================================");

  // 1. Check Database connection
  try {
    const plansCount = await prisma.membershipPlan.count();
    const clientsCount = await prisma.client.count();
    const membershipsCount = await prisma.membership.count();
    const paymentsCount = await prisma.payment.count();
    const trainersCount = await prisma.trainer.count();
    const attendanceCount = await prisma.attendance.count();
    const settings = await prisma.gymSettings.findUnique({ where: { id: "default" } });

    console.log("1. DATABASE CONNECTION & COUNTS:");
    console.log(`   - Membership Plans: ${plansCount}`);
    console.log(`   - Clients: ${clientsCount}`);
    console.log(`   - Memberships: ${membershipsCount}`);
    console.log(`   - Payments: ${paymentsCount}`);
    console.log(`   - Trainers: ${trainersCount}`);
    console.log(`   - Attendance Records: ${attendanceCount}`);
    console.log(`   - Gym Settings configured: ${settings ? "YES (" + settings.gymName + ")" : "NO"}`);
  } catch (err) {
    console.error("FAILED DATABASE CONNECTION:", err);
    process.exit(1);
  }

  // 2. Test Auth Session Token Generation
  try {
    const token = await createSessionToken({
      id: "admin-demo-id",
      email: "admin@gym.com",
      name: "Gym Director",
      role: "ADMIN",
    });
    console.log("2. AUTH TOKEN GENERATION: PASS (Token length:", token.length, ")");
  } catch (err) {
    console.error("FAILED AUTH TOKEN GENERATION:", err);
    process.exit(1);
  }

  // 3. Test Plan CRUD
  let createdPlanId = "";
  try {
    const newPlan = await prisma.membershipPlan.create({
      data: {
        name: "Test Elite Power Pass",
        durationDays: 45,
        price: 2500,
        description: "Test plan for automated verification",
        benefits: JSON.stringify(["Full floor access", "Free protein shake"]),
        isActive: true,
        sortOrder: 99,
      },
    });
    createdPlanId = newPlan.id;
    console.log("3. CREATE MEMBERSHIP PLAN: PASS (ID:", createdPlanId, ")");

    const updatedPlan = await prisma.membershipPlan.update({
      where: { id: createdPlanId },
      data: { price: 2700 },
    });
    console.log("   UPDATE MEMBERSHIP PLAN: PASS (New Price:", updatedPlan.price, ")");
  } catch (err) {
    console.error("FAILED PLAN CRUD:", err);
    process.exit(1);
  }

  // 4. Test Client Creation & Member ID generation
  let createdClientId = "";
  try {
    const testMemberId = `GYM-TEST-${Date.now().toString().slice(-4)}`;
    const newClient = await prisma.client.create({
      data: {
        memberId: testMemberId,
        fullName: "Karan Malhotra",
        phone: "+91 99887 76655",
        email: "karan.test@example.com",
        gender: "Male",
        address: "Indiranagar, Bangalore",
        emergencyContactName: "Pooja Malhotra",
        emergencyContactPhone: "+91 99887 76656",
        status: "ACTIVE",
      },
    });
    createdClientId = newClient.id;
    console.log("4. CREATE CLIENT: PASS (Member ID:", newClient.memberId, ")");
  } catch (err) {
    console.error("FAILED CLIENT CREATION:", err);
    process.exit(1);
  }

  // 5. Test Membership Subscription & Payment Creation
  let createdMembershipId = "";
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 45);

    const membership = await prisma.membership.create({
      data: {
        clientId: createdClientId,
        planId: createdPlanId,
        startDate,
        endDate,
        amount: 2700,
        discount: 200,
        finalAmount: 2500,
        paymentStatus: "PAID",
        status: "ACTIVE",
        notes: "Automated test subscription",
      },
    });
    createdMembershipId = membership.id;
    console.log("5. CREATE MEMBERSHIP: PASS (ID:", createdMembershipId, ")");

    const payment = await prisma.payment.create({
      data: {
        clientId: createdClientId,
        membershipId: createdMembershipId,
        amount: 2500,
        paymentMethod: "UPI",
        paymentDate: new Date(),
        transactionId: `TXN-TEST-${Date.now().toString().slice(-6)}`,
        status: "COMPLETED",
        notes: "Automated test payment",
      },
    });
    console.log("   CREATE PAYMENT: PASS (Txn:", payment.transactionId, ")");
  } catch (err) {
    console.error("FAILED MEMBERSHIP/PAYMENT:", err);
    process.exit(1);
  }

  // 6. Test Attendance
  try {
    const attendance = await prisma.attendance.create({
      data: {
        clientId: createdClientId,
        checkIn: new Date(),
        date: new Date(),
      },
    });
    console.log("6. CREATE ATTENDANCE: PASS (ID:", attendance.id, ")");
  } catch (err) {
    console.error("FAILED ATTENDANCE:", err);
    process.exit(1);
  }

  // 7. Cleanup Test Records
  try {
    await prisma.attendance.deleteMany({ where: { clientId: createdClientId } });
    await prisma.payment.deleteMany({ where: { clientId: createdClientId } });
    await prisma.membership.deleteMany({ where: { clientId: createdClientId } });
    await prisma.client.delete({ where: { id: createdClientId } });
    await prisma.membershipPlan.delete({ where: { id: createdPlanId } });
    console.log("7. TEST RECORD CLEANUP: PASS");
  } catch (err) {
    console.error("FAILED CLEANUP:", err);
    process.exit(1);
  }

  console.log("==================================================");
  console.log("ALL BACKEND & DATABASE OPERATIONS SUCCEEDED 100%");
  console.log("==================================================");
}

runTests()
  .catch((e) => {
    console.error("Fatal Test Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
