const { PrismaClient } = require('../prisma/generated/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL || 'mongodb://localhost:27017/v2YogaDBSandbox',
    },
  },
})

async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Test a simple query
    const userCount = await prisma.userData.count()
    console.log(`📊 UserData count: ${userCount}`)
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
