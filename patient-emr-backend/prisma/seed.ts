/**
 * Database seed script
 * Creates the initial admin user for the Patient EMR System
 *
 * Run with: npx ts-node prisma/seed.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Create admin user
  const adminEmail = 'admin@emr.health';
  const adminPassword = 'Admin@EMR2024!';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✓ Admin user already exists:', adminEmail);
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
      },
    });

    console.log('✓ Admin user created:');
    console.log('  Email:', adminEmail);
    console.log('  Password:', adminPassword);
    console.log('  Role: ADMIN\n');
    console.log('  ⚠️  IMPORTANT: Change this password after first login!\n');
  }

  // Create a sample doctor
  const doctorEmail = 'dr.smith@emr.health';
  const existingDoctor = await prisma.user.findUnique({ where: { email: doctorEmail } });

  if (!existingDoctor) {
    const hashedPassword = await bcrypt.hash('Doctor@EMR2024!', 12);
    await prisma.user.create({
      data: {
        email: doctorEmail,
        password: hashedPassword,
        firstName: 'James',
        lastName: 'Smith',
        role: 'DOCTOR',
        status: 'ACTIVE',
        emailVerified: true,
        doctorProfile: {
          create: {
            specialization: 'General Practice',
            department: 'Outpatient',
          },
        },
      },
    });
    console.log('✓ Sample doctor created:', doctorEmail, '/ Doctor@EMR2024!');
  }

  // Create a sample nurse
  const nurseEmail = 'nurse.johnson@emr.health';
  const existingNurse = await prisma.user.findUnique({ where: { email: nurseEmail } });

  if (!existingNurse) {
    const hashedPassword = await bcrypt.hash('Nurse@EMR2024!', 12);
    await prisma.user.create({
      data: {
        email: nurseEmail,
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'NURSE',
        status: 'ACTIVE',
        emailVerified: true,
        nurseProfile: {
          create: {
            department: 'Outpatient',
          },
        },
      },
    });
    console.log('✓ Sample nurse created:', nurseEmail, '/ Nurse@EMR2024!');
  }

  // Create a sample patient
  const patientEmail = 'patient.doe@example.com';
  const existingPatient = await prisma.user.findUnique({ where: { email: patientEmail } });

  if (!existingPatient) {
    const hashedPassword = await bcrypt.hash('Patient@EMR2024!', 12);
    await prisma.user.create({
      data: {
        email: patientEmail,
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'PATIENT',
        status: 'ACTIVE',
        emailVerified: true,
        patientProfile: {
          create: {
            bloodType: 'O+',
          },
        },
      },
    });
    console.log('✓ Sample patient created:', patientEmail, '/ Patient@EMR2024!');
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('  Admin:   admin@emr.health       / Admin@EMR2024!');
  console.log('  Doctor:  dr.smith@emr.health     / Doctor@EMR2024!');
  console.log('  Nurse:   nurse.johnson@emr.health / Nurse@EMR2024!');
  console.log('  Patient: patient.doe@example.com  / Patient@EMR2024!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
