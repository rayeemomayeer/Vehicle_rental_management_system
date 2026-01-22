import express, { Request, Response } from 'express';
import config

from './config';
import initDB from './config/db';
const app = express();

app.use(express.json());

initDB();

app.get('/', (req: Request, res: Response) => {
    res.send('hello');
})

export default app;