import { PostgresClient } from '../clients/PostgresClient';

export const UserMessagesProvider = (postgresClient: PostgresClient) =>  {
    return async (req, res) => {
        const recipientUsername = req.params.username;
        const senderUsername = req.query.sender;
        const getUserQuery = 'SELECT * FROM users WHERE username = $1';
        let userMessagesQuery;
        let queryValues = [recipientUsername];
        let validUsernames = true;

        await postgresClient
            .executeQuery(getUserQuery, queryValues)
            .then((data) => {
                if (data.rows.length !== 1) {
                    res.sendStatus(404);
                    validUsernames = false;
                }
            });

        if (senderUsername) {
            queryValues = [senderUsername];
            await postgresClient
                .executeQuery(getUserQuery, queryValues)
                .then((data) => {
                    if (data.rows.length !== 1) {
                        res.sendStatus(404);
                        validUsernames = false;
                    }
                })
                .catch((error) => {
                    console.error(error);
                    res.sendStatus(500);
                });

            if (!validUsernames) { return }

            userMessagesQuery = 'SELECT * FROM messages WHERE recipient_username = $1 ' +
                'AND sender_username = $2 ' +
                'AND timestamp > NOW() - INTERVAL \'30 days\' ORDER BY timestamp DESC LIMIT 100';
                queryValues = [recipientUsername, senderUsername];
        } else {
            userMessagesQuery = 'SELECT * FROM messages WHERE recipient_username = $1 ' +
                'AND timestamp > NOW() - INTERVAL \'30 days\' ORDER BY timestamp DESC LIMIT 100';
            queryValues = [recipientUsername];
        }

        await postgresClient.executeQuery(userMessagesQuery, queryValues)
            .then((data) => {res.json({'user':recipientUsername, 'messages': data.rows})})
            .catch((error) => {
                console.error(error);
                res.sendStatus(500);
            });
    }
};