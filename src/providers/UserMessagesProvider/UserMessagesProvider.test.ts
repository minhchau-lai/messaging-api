import { UserMessagesProvider } from './UserMessagesProvider';
import { PostgresClient } from '../../clients/PostgresClient/PostgresClient';

jest.mock('../../clients/PostgresClient/PostgresClient');

describe('UserMessagesProvider Tests', () => {
    const mockResponse = () => {
        const res = {
            sendStatus: jest.fn().mockReturnValue(this),
            json: jest.fn().mockReturnValue(this),
            status: jest.fn().mockReturnValue(this),
            send: jest.fn().mockReturnValue(this)
        };
        return res;
    };

    const mockRequest = (recipient, sender) => {
        return {
            params: {
                username: recipient
            },
            query: {
                sender: sender
            }
        }
    };

    let postgresClient;
    let messagesProvider;
    let response;

    beforeEach(() => {
        postgresClient = new PostgresClient();
        messagesProvider = UserMessagesProvider(postgresClient);
        response = mockResponse();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all messages for recipient user if exists', async () => {
        const recipient = 'minhminh';
        const mockMessages = [{message: 'message1'}];
        const req = mockRequest(recipient, '');

        postgresClient.executeQuery
            .mockReturnValueOnce(Promise.resolve({rows: [recipient]}))
            .mockReturnValueOnce(Promise.resolve({rows: mockMessages}));

        await messagesProvider(req, response).then((data) => {
            expect(postgresClient.executeQuery).toHaveBeenCalledTimes(2);
            expect(response.json).toHaveBeenCalledWith({user: recipient, messages: mockMessages});
        });
    });

    it('should return filtered messages by sender for recipient user if both exist', async () => {
        const recipient = 'minhminh';
        const sender = 'john';
        const mockMessages = [{message: 'message1'}];
        const req = mockRequest(recipient, sender);

        postgresClient.executeQuery
            .mockReturnValueOnce(Promise.resolve({rows: [recipient]}))
            .mockReturnValueOnce(Promise.resolve({rows: [sender]}))
            .mockReturnValueOnce(Promise.resolve({rows: mockMessages}));

        await messagesProvider(req, response).then((data) => {
            expect(postgresClient.executeQuery).toHaveBeenCalledTimes(3);
            expect(response.json).toHaveBeenCalledWith({user: recipient, messages: mockMessages});
        });
    });

    it('should send 404 response if recipient param not provided', async () => {
        const req = mockRequest('', 'john');

        await messagesProvider(req, response).then((data) => {
            expect(postgresClient.executeQuery).toHaveBeenCalledTimes(0);
            expect(response.sendStatus).toHaveBeenCalledWith(404);
        })
    });

    it('should send 404 response if recipient does not exist', async () => {
        const recipient = 'minh';
        const req = mockRequest(recipient, '');

        postgresClient.executeQuery.mockReturnValue((Promise.resolve({rows: []})));

        await messagesProvider(req, response).then((data) => {
            expect(postgresClient.executeQuery).toHaveBeenCalledTimes(1);
            expect(response.sendStatus).toHaveBeenCalledWith(404);
        })
    });

    it('should send 500 response if server error during recipient existence check', async () => {
        const recipient = 'minh';
        const req = mockRequest(recipient, '');

        postgresClient.executeQuery.mockReturnValue((Promise.reject('some reason')));

        await messagesProvider(req, response).then((data) => {
            expect(postgresClient.executeQuery).toHaveBeenCalledTimes(1);
            expect(response.sendStatus).toHaveBeenCalledWith(500);
        })
    });

    it('should send 404 response if sender provided and not exist', async () => {
        const recipient = 'minh';
        const sender = 'john';
        const req = mockRequest(recipient, sender);

        postgresClient.executeQuery
            .mockReturnValueOnce(Promise.resolve({rows: [recipient]}))
            .mockReturnValueOnce(Promise.resolve({rows: []}));

        await messagesProvider(req, response).then((data) => {
            expect(postgresClient.executeQuery).toHaveBeenCalledTimes(2);
            expect(response.sendStatus).toHaveBeenCalledWith(404);
        });
    })

    it('should send 500 response if sender provided and server error during check', async () => {
        const recipient = 'minh';
        const sender = 'john';
        const req = mockRequest(recipient, sender);

        postgresClient.executeQuery
            .mockReturnValueOnce(Promise.resolve({rows: [recipient]}))
            .mockReturnValueOnce(Promise.reject('some error'));

        await messagesProvider(req, response).then((data) => {
            expect(postgresClient.executeQuery).toHaveBeenCalledTimes(2);
            expect(response.sendStatus).toHaveBeenCalledWith(500);
        });
    })

    it('should return 500 response if server error when returning messages and sender and recipient exist', async () => {
        const recipient = 'minhminh';
        const sender = 'john';
        const mockMessages = [{message: 'message1'}];
        const req = mockRequest(recipient, sender);

        postgresClient.executeQuery
            .mockReturnValueOnce(Promise.resolve({rows: [recipient]}))
            .mockReturnValueOnce(Promise.resolve({rows: [sender]}))
            .mockReturnValueOnce(Promise.reject('some error'));

        await messagesProvider(req, response).then((data) => {
            expect(postgresClient.executeQuery).toHaveBeenCalledTimes(3);
            expect(response.sendStatus).toHaveBeenCalledWith(500);
        });
    });
});