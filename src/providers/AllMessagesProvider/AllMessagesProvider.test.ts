import { AllMessagesProvider } from './AllMessagesProvider';
import {PostgresClient} from '../../clients/PostgresClient/PostgresClient';

jest.mock('../../clients/PostgresClient/PostgresClient');

describe('AllMessagesProvider Tests', () => {
    const mockResponse = () => {
        const res = {
            sendStatus: jest.fn().mockReturnValue(this),
            json: jest.fn().mockReturnValue(this)
        };
        return res;
    };
    let postgresClient;
    let messagesProvider;
    beforeEach(() => {
        postgresClient = new PostgresClient();
        messagesProvider = AllMessagesProvider(postgresClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should make a db query and return messages', async () => {
        const messageData = {
            rows: [{'message': 'something'}]
        };
        const mockData = new Promise(() => messageData);
        const res = mockResponse();

        postgresClient.executeQuery.mockReturnValue(mockData);
        messagesProvider({}, res).then((data) => {
            expect(data).toBe(mockData);
            expect(res.json).toHaveBeenCalledWith({'messages': messageData.rows});
        });
        expect(postgresClient.executeQuery).toHaveBeenCalledTimes(1);
    });

    it('should send 500 response on server error ', () => {
        const dbError = Promise.reject('Some DB error');
        const res = mockResponse();

        postgresClient.executeQuery.mockReturnValue(dbError);
        messagesProvider({}, res).then().catch((error) => {
            expect(error.message).toBe('Some DB error');
            expect(res.sendStatus).toHaveBeenCalledWith(500);
        });
        expect(postgresClient.executeQuery).toHaveBeenCalledTimes(1);
    });
});