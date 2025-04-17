// Set up db connection here
const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'practice-mongo';

async function connectDB() {
  await client.connect();
  console.log('Connected to MongoDB');
  return client.db(dbName);
}

module.exports = connectDB;
