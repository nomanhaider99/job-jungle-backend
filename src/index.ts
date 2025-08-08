import express from 'express';
import { config } from 'dotenv';
import { connectMongoDBDatabase } from './configs/database';
import candidateRoutes from './routes/candidate.routes'
import companyRoutes from './routes/company.routes'
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());
config();
connectMongoDBDatabase();

app.use('/api/v1/candidate', candidateRoutes);
app.use('/api/v1/company', companyRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is Listening on PORT: ${process.env.PORT}`);
});