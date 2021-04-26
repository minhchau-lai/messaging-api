import { Router } from 'express';
import { PostgresClient } from '../clients/PostgresClient/PostgresClient';
import { AllMessagesProvider } from '../providers/AllMessagesProvider/AllMessagesProvider';
import { SendMessagesProvider } from '../providers/SendMessagesProvider/SendMessagesProvider';
import {UserMessagesProvider} from "../providers/UserMessagesProvider/UserMessagesProvider";

export const MessagesRouter = (postgresClient: PostgresClient) => {
    const messagesRouter = Router();

    messagesRouter.get('/:username', UserMessagesProvider(postgresClient));
    messagesRouter.post('/', SendMessagesProvider(postgresClient));
    messagesRouter.get('/', AllMessagesProvider(postgresClient));

    return messagesRouter;
};