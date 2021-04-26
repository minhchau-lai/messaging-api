import { AllMessagesProvider } from './AllMessagesProvider';
import { PostgresClient } from '../../clients/PostgresClient/PostgresClient';

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
            rows: [{message: 'something'}]
        };
        const mockData = Promise.resolve(messageData);
        const res = mockResponse();

        postgresClient.executeQuery.mockReturnValue(mockData);
        await messagesProvider({}, res).then((data) => {
            expect(postgresClient.executeQuery).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({messages: messageData.rows});
        });
    });

    it('should send 500 response on server error ', async () => {
        const dbError = Promise.reject('Some DB error');
        const res = mockResponse();

        postgresClient.executeQuery.mockReturnValue(dbError);
        await messagesProvider({}, res)
            .then((data) => {
                expect(postgresClient.executeQuery).toHaveBeenCalledTimes(1);
                expect(res.sendStatus).toHaveBeenCalledWith(500);
            });
    });
});