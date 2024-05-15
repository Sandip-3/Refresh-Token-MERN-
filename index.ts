import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import dbConnect from './src/config/dbConnect';
import { config } from 'dotenv';
import routes from './src/routes';
import env from './src/config/env';
import logger from './src/config/logger';

config();


(async () => {
  const app = express();
  app.use(bodyParser.json());

  app.use(cors(env.cors ? { origin: env.cors, optionsSuccessStatus: 200 } : undefined));

  morgan.token('level', (req: Request, res: Response) => {
    const statusCode = res.statusCode;
    if (statusCode >= 500) {
      return '[ERROR]';
    } else if (statusCode >= 400) {
      return '[WARN]';
    } else {
      return '[INFO]';
    }
  });
  app.use(
    morgan(':date[iso] :level :method :url :status :res[content-length] :referrer :total-time[5] - :response-time ms'),
  );

  //Add your route path prefix
  app.use('/api/v1', routes);

  app.all('*', function (req, res) {
    res.status(404).send('Path not found');
  });

  app.listen(env.port, () => {
    console.log(`The application is listening on port \x1b[4m\x1b[31m${env.port}\x1b[0m`);
    dbConnect();
  });
  process.on('SIGINT', () => {
    process.exit();
  });
  // Unhandled Promise Rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(JSON.stringify({ message: `Unhandled Rejection at:, ${promise}`, error: reason }));
  });

  // Unhandled Exceptions
  process.on('uncaughtException', error => {
    logger.error(JSON.stringify({ message: `Uncaught Exception:, ${error}` }));
  });
})();
