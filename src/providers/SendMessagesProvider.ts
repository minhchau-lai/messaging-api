import { v4 as uuidv4 } from 'uuid';
import { PostgresClient } from '../clients/PostgresClient';

export const SendMessagesProvider = (postgresClient: PostgresClient) => {
    return async (req, res) => {
        const senderUsername = req.body.senderUsername;
        const recipientUsername = req.body.recipientUsername;
        const messageBody = req.body.messageBody;

        const insertMessageQuery =
            'INSERT INTO messages("message_id", "sender_username", "recipient_username", "message_body") ' +
            'VALUES($1, $2, $3, $4) RETURNING message_id';

        const getUserQuery = 'SELECT * FROM users WHERE username = $1 OR username = $2';

        if (messageBody && senderUsername && recipientUsername) {
            let validSenderAndRecipient = true;
            await postgresClient
                .executeQuery(getUserQuery, [senderUsername, recipientUsername])
                .then( (data) => {
                    if (data.rows.length !== 2) {
                        res.sendStatus(404)}
                        validSenderAndRecipient = false;
                })
                .catch((error) => {
                        console.error(error);
                        res.sendStatus(500);
                });

            if (!validSenderAndRecipient) { return }

            const messageId = uuidv4();
            const queryValues = [messageId, senderUsername, recipientUsername, messageBody];

            await postgresClient.executeQuery(insertMessageQuery, queryValues)
                .then((data) => res.status(201).send({'messages': data.rows[0]}))
                .catch((error) => {
                    console.error(error);
                    res.sendStatus(500);
                });
        } else {
            res.sendStatus(400);
        }
    }
};