import { PostgresClient } from '../../clients/PostgresClient/PostgresClient';

export const UserMessagesProvider = (postgresClient: PostgresClient) =>  {
    return async (req, res) => {
        const recipientUsername = req.params.username;
        const senderUsername = req.query.sender;
        const getUserQuery = 'SELECT * FROM users WHERE username = $1';
        let userMessagesQuery;
        let queryValues = [recipientUsername];
        let validUsernames = true;

        if (!recipientUsername) {
            res.sendStatus(404);
            return;
        }

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
                // res.sendStatus does not return/prevent further execution
                // set false so that function returns before executing rest of provider logic
                validUsernames = false;
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
                    validUsernames = false;
                });

            userMessagesQuery = 'SELECT * FROM messages WHERE recipient_username = $1 ' +
                'AND sender_username = $2 ' +
                'AND timestamp > NOW() - INTERVAL \'30 days\' ORDER BY timestamp DESC LIMIT 100';
                queryValues = [recipientUsername, senderUsername];
        } else {
            userMessagesQuery = 'SELECT * FROM messages WHERE recipient_username = $1 ' +
                'AND timestamp > NOW() - INTERVAL \'30 days\' ORDER BY timestamp DESC LIMIT 100';
            queryValues = [recipientUsername];
        }

        if (!validUsernames) { return }

        await postgresClient.executeQuery(userMessagesQuery, queryValues)
            .then((data) => {res.json({user: recipientUsername, messages: data.rows})})
            .catch((error) => {
                console.error(error);
                res.sendStatus(500);
            });
    }
};