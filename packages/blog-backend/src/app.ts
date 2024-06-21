// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import * as path from 'path';
import apiRouter from './routes/api';
import { serverConfig } from './config/server.config';
import { update } from './utils/md';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { setTimeout } from 'timers/promises';

const config = serverConfig();
const PORT = config.server.port;

const app = express();

async function initialize(): Promise<void> {
  await update();
}

async function startServer(): Promise<void> {
  try {
    await initialize();

    app.use(helmet());

    // front-build(static) path
    const staticPath = path.join(__dirname, '../static');
    // static
    app.use('/blog-static', (req, res, next) => {
      // if (req.path.startsWith('/static')) {
      // }
      console.log('Static file requested:', req.path);
      next();
    });
    app.use('/blog-static', express.static(staticPath));

    // api
    app.use('/api', apiRouter);

    // extra
    app.get('*', (req, res) => {
      console.log('req url: ', req.url);
      res.sendFile(path.join(staticPath, 'index.html'));
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
