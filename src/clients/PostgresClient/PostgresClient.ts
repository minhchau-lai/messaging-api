import { Pool } from 'pg';

export class PostgresClient {
    private databaseUrl: string;
    private postgresClient: Pool;
    private initialQuery: string;

    constructor() {
        this.databaseUrl = process.env.DATABASE_URL || "postgres://minhchau:lai@postgres:5432/db";
        this.postgresClient = new Pool({
            max: 5,
            connectionString: this.databaseUrl
        });

        // This script ensures that the necessary tables and columns exist when starting up the app from docker compose
        // TODO: (for future consideration) postgres ran from docker compose has an entrypoint that takes a SQL file to initialize
        this.initialQuery =
            'CREATE TABLE IF NOT EXISTS users ( username VARCHAR(255) PRIMARY KEY );' +
            'CREATE TABLE IF NOT EXISTS messages ( message_id VARCHAR(255),' +
            'sender_username VARCHAR(255) NOT NULL, recipient_username VARCHAR(255) NOT NULL,' +
            'message_body VARCHAR(1000) NOT NULL, timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,' +
            'PRIMARY KEY (message_id));' +
            'INSERT INTO users VALUES(\'minhchau-lai\') ON CONFLICT DO NOTHING;' +
            'INSERT INTO users VALUES(\'john-smith\') ON CONFLICT DO NOTHING;' +
            'INSERT INTO users VALUES(\'alex.realperson\') ON CONFLICT DO NOTHING';
        this.executeQuery(this.initialQuery, [])
            .then((res) => console.log('DB initialized'))
            .catch((error) => {
                console.error(error);
            });
    }

    async executeQuery(query: string, values: string[]) {
        try {
            return await this.postgresClient.query(query, values);
        } catch (error) {
            throw error;
        }
    }
}