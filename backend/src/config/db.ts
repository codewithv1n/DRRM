import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("WARNING: DATABASE_URL is not defined in the environment variables (.env file).");
}

const pool = new Pool({
    connectionString,
    // Note: If your self-hosted Eprovider platform is deployed securely in a production environment
    // and requires SSL/TLS, you can uncomment the ssl configuration below:
    /*
    ssl: {
        rejectUnauthorized: false
    }
    */
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err);
});

export default pool;
