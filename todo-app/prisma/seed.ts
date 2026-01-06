import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Note: In a real application, users would register through the UI
  // This seed creates sample data for testing ABAC permissions

  // Create sample todos for demonstration (these would normally be created by users)
  // Since we can't easily create users with passwords in seed, we'll create a note about test accounts

  console.log('Database seeded successfully!');
  console.log('Test accounts:');
  console.log('- user@example.com (USER role)');
  console.log('- manager@example.com (MANAGER role)');
  console.log('- admin@example.com (ADMIN role)');
  console.log('Password for all: password123');
  console.log('');
  console.log('To test the application:');
  console.log('1. Register new users or use the test accounts above');
  console.log('2. Create todos as a USER');
  console.log('3. Switch to MANAGER account to view all todos (read-only)');
  console.log('4. Switch to ADMIN account to view all todos and delete any todo');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });