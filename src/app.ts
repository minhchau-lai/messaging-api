import express from 'express';
import bodyParser from 'body-parser';
import { MessagesRouter } from './routes/MessagesRouter';
import { PostgresClient } from './clients/PostgresClient/PostgresClient';
import { swaggerConfig } from './resources/swagger'

const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(bodyParser.json());
const port = process.env.port || 3000;

const postgresClient = new PostgresClient();


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.use('/messages', MessagesRouter(postgresClient));

app.use('/', (req, res) => {
    res.send('Messaging API is ready');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});