import { Pool } from 'pg';

export class PostgresClient {
    private databaseUrl: String;
    private postgresClient: Pool;

    constructor() {
        this.databaseUrl = process.env.DATABASE_URL || "postgres://minhchau:lai@postgres:5432/db";
        this.postgresClient = new Pool({
            max: 5,
            connectionString: this.databaseUrl
        })
    }

    async initializeDb() {
        this.postgresClient.connect((err, client, done) => {
            console.log("initializing db");
            if (err) throw err;
            const query = 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";' +
                'CREATE TABLE IF NOT EXISTS users ( username VARCHAR(50) PRIMARY KEY );' +
                'CREATE TABLE IF NOT EXISTS messages ( message_id uuid DEFAULT uuid_generate_v4 (),' +
                'sender_username VARCHAR(50) NOT NULL, recipient_username VARCHAR(50) NOT NULL,' +
                'message_body VARCHAR(1000) NOT NULL, timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,' +
                'PRIMARY KEY (message_id))';
            client.query(query);
        })
    }
}