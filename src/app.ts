import express from 'express';
import bodyParser from 'body-parser';
import { PostgresClient } from './clients/PostgresClient';

const app = express();

const port = process.env.port || 3000;
const postgresClient = new PostgresClient();

await(postgresClient.initializeDb());

app.use(bodyParser.json());

app.use('/', (req, res) => {
    res.send('Messaging API is ready');

});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});