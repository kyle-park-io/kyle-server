// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import * as path from 'path';
import apiRouter from './routes/api';

import { update } from './utils/md';

const app = express();
const PORT = 8080;

async function initialize(): Promise<void> {
  await update();
}

async function startServer(): Promise<void> {
  try {
    await initialize();

    app.use(helmet());

    const buildPath = path.join(__dirname, '../build');
    app.use(express.static(buildPath));

    app.use('/api', apiRouter);

    app.get('*', (req, res) => {
      console.log('check : ', req.url);
      res.sendFile(path.join(buildPath, 'index.html'));
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
}

void startServer();
