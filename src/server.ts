import express, {NextFunction, Request, Response} from 'express';
import helmet from 'helmet';

import {register} from "./middlewares/prometheus"
import v1Router from "./routes"

const app = express();

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );
  next();
});
app.use(helmet());
app.use(express.json());
app.get('/metrics', async function (req, res) {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
app.use("/api/v1", v1Router)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
});

const port = Number(process.env.PORT) || 3333;
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${port}`);
});