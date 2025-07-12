// test-mongo-connection.js
const { MongoClient } = require('mongodb')

async function testConnection() {
  // Test with replica set
  const uriWithReplSet =
    'mongodb://localhost:27017/v2YogaDBSandbox?replicaSet=rs0'

  try {
    console.log('Testing connection with replica set...')
    const client = new MongoClient(uriWithReplSet)
    await client.connect()

    const db = client.db('v2YogaDBSandbox')
    const collections = await db.listCollections().toArray()

    console.log('✅ Replica set connection successful!')
    console.log(
      'Collections:',
      collections.map((c) => c.name)
    )

    await client.close()
  } catch (error) {
    console.log('❌ Replica set connection failed:', error.message)

    // Try without replica set
    try {
      console.log('\nTesting connection without replica set...')
      const uriWithoutReplSet = 'mongodb://localhost:27017/v2YogaDBSandbox'
      const client = new MongoClient(uriWithoutReplSet)
      await client.connect()

      console.log('✅ Single instance connection successful!')
      await client.close()
    } catch (singleError) {
      console.log(
        '❌ Single instance connection also failed:',
        singleError.message
      )
    }
  }
}

testConnection()
