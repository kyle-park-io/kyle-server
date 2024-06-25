// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import * as path from 'path';
import apiRouter from './routes/api';
import { serverConfig } from './config/server.config';
import { update } from './utils/md';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { setTimeout } from 'timers/promises';
import { setInterval } from 'timers';

const config = serverConfig();
const PORT = config.server.port;

const app = express();

async function initialize(): Promise<void> {
  console.log('blog update!');
  await update();
}

function executeAsyncFunction() {
  initialize().catch((err) => {
    console.error('Error executing scheduled function:', err);
  });
}

async function startServer(): Promise<void> {
  try {
    // schedule
    await initialize();
    const intervalId = setInterval(executeAsyncFunction, 1000 * 60 * 10);

    // helmet, csp
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        },
      }),
    );

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
