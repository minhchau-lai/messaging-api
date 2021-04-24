import express from 'express';
import bodyParser from 'body-parser';

const app = express();

const port = 3002;

app.use(bodyParser.json());

app.use('/', (req, res) => {
    res.send('Messaging API is ready');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});