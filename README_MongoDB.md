Here are the complete details for **Method 1: Single Instance Replica Set** for your MongoDB setup:

## Method 1: Single Instance Replica Set (Simplest)

This method uses your existing configuration and creates a replica set with just one MongoDB instance - perfect for development with Prisma.

### Step 1: Start MongoDB with your current config

Open Command Prompt as Administrator and run:

```bash
mongod --config C:/data/config/mongod.conf
```

Your existing `mongod.conf` already has the replica set configuration:

```yaml
replication:
  replSetName: 'rs0'
```

### Step 2: Connect to MongoDB and initialize the replica set

Open a **second** Command Prompt window and connect to MongoDB:

```bash
mongosh
```

Or if you need to specify the connection explicitly:

```bash
mongosh "mongodb://localhost:27017"
```

### Step 3: In the MongoDB shell, run the initialization

Once connected to the MongoDB shell, initialize the replica set:

```javascript
rs.initiate({
  _id: 'rs0',
  members: [{ _id: 0, host: 'localhost:27017' }],
})
```

You should see output similar to:

```javascript
{
  ok: 1,
  '$clusterTime': { ... },
  operationTime: Timestamp({ ... })
}
```

### Step 4: Verify the replica set status

Check that the replica set is working correctly:

```javascript
rs.status()
```

You should see output showing:

- One member with `"stateStr": "PRIMARY"`
- `"set": "rs0"`
- `"health": 1`

Also verify with a simpler command:

```javascript
rs.conf()
```

### Step 5: Test your connection string

Exit the MongoDB shell (`exit` or `Ctrl+C`) and test your application connection string:

```bash
# Your current connection string should now work:
mongodb://localhost:27017/v2YogaDBSandbox?replicaSet=rs0
```

### Complete Process Summary

1. **Terminal 1**: Start MongoDB daemon

   ```bash
   mongod --config C:/data/config/mongod.conf
   ```

2. **Terminal 2**: Initialize replica set

   ```bash
   mongosh
   rs.initiate({_id: "rs0", members: [{_id: 0, host: "localhost:27017"}]})
   rs.status()
   exit
   ```

3. **Your app**: Should now connect successfully with:
   ```bash
   DATABASE_URL='mongodb://localhost:27017/v2YogaDBSandbox?replicaSet=rs0'
   ```

### Troubleshooting

If initialization fails:

1. **Check if MongoDB is running:**

   ```bash
   mongosh --eval "db.runCommand('ping')"
   ```

2. **Force reconfigure (if needed):**

   ```javascript
   rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '127.0.0.1:27017' }] })
   ```

3. **Check replica set name matches your config:**
   ```javascript
   db.hello().setName // Should return "rs0"
   ```

This single-instance replica set satisfies Prisma's requirement while keeping your development setup simple.

### Prisma Database

Start using Prisma Client in Node.js (See: https://pris.ly/d/client)

```js
import { PrismaClient } from './prisma/generated/client'
const prisma = new PrismaClient()
```

or start using Prisma Client at the edge (See: https://pris.ly/d/accelerate)

```js
import { PrismaClient } from './prisma/generated/client/edge'
const prisma = new PrismaClient()
```

```bash
npx prisma generate
```

```bash
npm exec prisma db push
```

This is failing for mongodb at the moment (2024-08-09 06:22:38)

```bash
npm exec prisma migrate dev
```
