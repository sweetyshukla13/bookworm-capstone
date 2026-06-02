require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('🔍 Testing Database Connection...\n');

console.log('Configuration:');
console.log('- Host:', process.env.DB_HOST || 'localhost');
console.log('- Port:', process.env.DB_PORT || 5432);
console.log('- Database:', process.env.DB_NAME || 'bookworm');
console.log('- User:', process.env.DB_USER || 'postgres');
console.log('- Password:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
console.log('');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'bookworm',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test query
    const [results] = await sequelize.query('SELECT version()');
    console.log('✅ PostgreSQL Version:', results[0].version);
    
    // List existing tables
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\n📋 Existing tables in database:');
    if (tables.length === 0) {
      console.log('   (No tables found - database is empty)');
    } else {
      tables.forEach(t => console.log('   -', t.table_name));
    }
    
    await sequelize.close();
    console.log('\n✅ Connection test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('\nError details:');
    console.error('- Name:', error.name);
    console.error('- Message:', error.message);
    
    if (error.original) {
      console.error('\nOriginal error:');
      console.error('- Code:', error.original.code);
      console.error('- Detail:', error.original.detail || 'N/A');
    }
    
    console.error('\n💡 Common solutions:');
    console.error('1. Ensure PostgreSQL is running');
    console.error('2. Check database exists: CREATE DATABASE bookworm;');
    console.error('3. Verify credentials in .env file');
    console.error('4. Check PostgreSQL is listening on port', process.env.DB_PORT || 5432);
    
    process.exit(1);
  }
}

testConnection();

// Made with Bob
