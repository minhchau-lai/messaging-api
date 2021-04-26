import { SendMessagesProvider } from './SendMessagesProvider';
import { PostgresClient } from '../../clients/PostgresClient/PostgresClient';

jest.mock('../../clients/PostgresClient/PostgresClient');

describe('SendMessagesProvider Tests', () => {
    const mockResponse = () => {
        const res = {
            sendStatus: jest.fn().mockReturnValue(this),
            json: jest.fn().mockReturnValue(this),
            status: jest.fn().mockReturnValue(this),
            send: jest.fn().mockReturnValue(this)
        };
        return res;
    };

    const mockRequest = (reqParams) => {
        return {
            body: reqParams
        }
    };

    let postgresClient;
    let messagesProvider;
    let res;

    beforeEach(() => {
        postgresClient = new PostgresClient();
        messagesProvider = SendMessagesProvider(postgresClient);
        res = mockResponse();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should make a request and return messageId if all params valid and users exist', async () => {
        const reqParams = {
            senderUsername: 'minhminh',
            recipientUsername: 'john',
            messageBody: 'some message here'
        };
        const req = mockRequest(reqParams);

        postgresClient.executeQuery
            .mockReturnValueOnce(Promise.resolve({rows: ['minhminh', 'john']}))
            .mockReturnValueOnce(Promise.resolve({rows: ['some UUID']}));

        await messagesProvider(req, res).then((data) => {
            expect(postgresClient.executeQuery).toHaveBeenCalledTimes(2);
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    it('should send 404 response if one or both users not exist', async () => {
        const reqParams = {
            senderUsername: 'some-person',
            recipientUsername: 'user-not-exist',
            messageBody: 'some other message'
        };

        const req = mockRequest(reqParams);

        postgresClient.executeQuery.mockResolvedValue({rows: ['some-person']});

        await messagesProvider(req, res).then((data) => {
            expect(postgresClient.executeQuery).toHaveBeenCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(404);
        })
    });

    it('should send 400 response when missing params ', async () => {
        const reqParams = {
            senderUsername: 'minhminh',
            recipientUsername: 'john',
            messageBody: ''
        };

        const req = mockRequest(reqParams);

        await messagesProvider(req, res);
        expect(postgresClient.executeQuery).toHaveBeenCalledTimes(0);
        expect(res.sendStatus).toHaveBeenCalledWith(400);
    });

    it('should send 500 response on server error ', async () => {
        const reqParams = {
            senderUsername: 'minhminh',
            recipientUsername: 'john',
            messageBody: 'some message here'
        };

        const dbError = Promise.reject('Some DB error');
        const req = mockRequest(reqParams);

        postgresClient.executeQuery.mockReturnValue(dbError);

        await messagesProvider(req, res)
            .then((data) => {
                expect(postgresClient.executeQuery).toHaveBeenCalledTimes(1);
                expect(res.sendStatus).toHaveBeenCalledWith(500);
            });
    });
});