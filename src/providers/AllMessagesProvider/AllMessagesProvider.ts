import { PostgresClient } from '../../clients/PostgresClient/PostgresClient';

export const AllMessagesProvider = (postgresClient: PostgresClient) => {
    return async (req, res) => {
        const query =
            'SELECT * FROM messages WHERE timestamp > NOW() - INTERVAL \'30 days\' ORDER BY timestamp DESC LIMIT 100';
         await postgresClient.executeQuery(query, [])
             .then((data) => res.json({'messages': data.rows}))
             .catch((error) => {
                 console.error(error);
                 res.sendStatus(500);
             });
    }
};