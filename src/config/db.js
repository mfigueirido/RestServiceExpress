const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;

  let connected = false;

  if (uri) {
    try {
      await mongoose.connect(uri);
      console.log('MongoDB connected (external)');
      connected = true;
    } catch (err) {
      console.error('Failed to connect to external DB:', err.message || err);
    }
  }

  // If not connected and not in production, try an in-memory MongoDB as fallback.
  if (!connected && process.env.NODE_ENV !== 'production') {
    console.log('Using in-memory MongoDB fallback for non-production environment');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      console.log('Starting mongodb-memory-server (may download Mongo binaries on first run)');

      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      console.log('In-memory MongoDB URI:', memUri);

      await mongoose.connect(memUri);
      console.log('MongoDB connected (in-memory)');
      connected = true;
    } catch (err) {
      console.error('Failed to start in-memory MongoDB:', err.message || err);
    }
  }

  if (!connected) {
    throw new Error('Could not connect to a MongoDB instance');
  }
}

module.exports = connectDB;
