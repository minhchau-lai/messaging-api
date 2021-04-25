import express from 'express';
import bodyParser from 'body-parser';
import { PostgresClient } from './clients/PostgresClient/PostgresClient';
import { MessagesRouter } from './routes/MessagesRouter';

const app = express();

const port = process.env.port || 3000;

const postgresClient = new PostgresClient();

app.use(bodyParser.json());

app.use('/messages', MessagesRouter(postgresClient));

app.use('/', (req, res) => {
    res.send('Messaging API is ready');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});