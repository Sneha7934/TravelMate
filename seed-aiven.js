/**
 * TravelMate Database Seeder for Aiven MySQL
 * Uses pure-JS mysql2 with full caching_sha2_password & SSL support.
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Zero-dependency .env parser
function loadEnvFile(envPath) {
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.substring(0, eqIdx).trim();
        let val = trimmed.substring(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        env[key] = val;
      }
    }
  }
  return env;
}

async function main() {
  console.log('\n==============================================');
  console.log('   TravelMate Aiven MySQL Database Seeder     ');
  console.log('==============================================\n');

  const envFile = loadEnvFile(path.join(__dirname, '.env'));

  const host = envFile.AIVEN_DB_HOST;
  const port = parseInt(envFile.AIVEN_DB_PORT, 10);
  const user = envFile.AIVEN_DB_USER || 'avnadmin';
  const password = envFile.AIVEN_DB_PASSWORD;
  const database = envFile.AIVEN_DB_NAME || 'defaultdb';

  if (!host || !port || !password) {
    console.error('Error: AIVEN_DB_HOST, AIVEN_DB_PORT, or AIVEN_DB_PASSWORD missing in .env');
    process.exit(1);
  }

  const sqlFilePath = path.join(__dirname, 'travelmate.sql');
  if (!fs.existsSync(sqlFilePath)) {
    console.error(`Error: travelmate.sql not found at ${sqlFilePath}`);
    process.exit(1);
  }

  console.log(`Connecting to Aiven MySQL at ${host}:${port} (${database})...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      ssl: {
        rejectUnauthorized: false,
      },
      multipleStatements: true,
    });

    console.log('Connected successfully via SSL / caching_sha2_password!\n');

    console.log('Reading travelmate.sql...');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('Executing database schema and seed data into Aiven...');
    await connection.query(sql);

    console.log('\n==============================================');
    console.log(' SUCCESS: All tables and data seeded into Aiven!');
    console.log('==============================================\n');

    console.log('Verifying table row counts in Aiven:');
    const [counts] = await connection.query(`
      SELECT 'destinations' AS tbl, COUNT(*) AS total FROM destinations
      UNION ALL
      SELECT 'attractions' AS tbl, COUNT(*) AS total FROM attractions
      UNION ALL
      SELECT 'users' AS tbl, COUNT(*) AS total FROM users
      UNION ALL
      SELECT 'favorites' AS tbl, COUNT(*) AS total FROM favorites
      UNION ALL
      SELECT 'reviews' AS tbl, COUNT(*) AS total FROM reviews;
    `);

    console.table(counts);

  } catch (err) {
    console.error('\nSeeding failed with error:');
    console.error(err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main().catch(console.error);
