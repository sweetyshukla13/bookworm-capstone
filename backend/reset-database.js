require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('🔄 Database Reset Script\n');

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

async function resetDatabase() {
  try {
    console.log('📋 Listing existing tables...');
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (tables.length === 0) {
      console.log('✅ No tables found - database is clean');
      await sequelize.close();
      process.exit(0);
    }
    
    console.log(`Found ${tables.length} tables:`);
    tables.forEach(t => console.log('   -', t.table_name));
    
    console.log('\n⚠️  WARNING: This will DROP ALL TABLES!');
    console.log('Dropping tables in 3 seconds...');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n🗑️  Dropping all tables...');
    
    // Drop all tables
    for (const table of tables) {
      await sequelize.query(`DROP TABLE IF EXISTS "${table.table_name}" CASCADE`);
      console.log(`   ✓ Dropped ${table.table_name}`);
    }
    
    console.log('\n✅ All tables dropped successfully!');
    console.log('💡 Now run: npm run dev');
    
    await sequelize.close();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Reset failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

resetDatabase();

// Made with Bob
