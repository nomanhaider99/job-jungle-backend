import express, { Request, Response } from 'express';
import { config } from 'dotenv';


const app = express();
config();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello From / Route!');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is Listening on PORT: ${process.env.PORT}`);
});