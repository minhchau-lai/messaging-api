import { Pool } from 'pg';
import { PostgresClient } from './PostgresClient';

jest.mock('pg', () => {
    const poolClient = {
        query: jest.fn()
    };
    return { Pool: jest.fn(() => poolClient)  };
});

describe('PostgresClient Tests', () => {
    let postgresClient;
    let pool;

    beforeEach(() => {
        pool = new Pool;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should instantiate and populate the db', () => {
        postgresClient = new PostgresClient();
        expect(postgresClient).toBeInstanceOf(PostgresClient);
        expect(pool.query).toHaveBeenCalledTimes(1);
    });

    it('should catch and log db errors', () => {
        const error = new Error('db connection failed');
        pool.query.mockRejectedValueOnce(error);
        try {
            postgresClient = new PostgresClient();
        } catch (error) {
            expect(error.message).toBe('db connection failed');
        }
        expect(pool.query).toHaveBeenCalledTimes(1);
    });
});