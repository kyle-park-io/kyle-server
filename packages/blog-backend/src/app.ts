import express from 'express';
import helmet from 'helmet';
import * as path from 'path';
import apiRouter from './routes/api';
import { serverConfig } from './config/server.config';
import { mountBlog } from './blog/serve';

export interface AppOptions {
  /** Directory holding the built astro output that is served at /blog. */
  blogDist: string;
  /** Directory holding the SPA webpack build, served at /blog-static. */
  spaStatic: string;
}

export function createApp(options: AppOptions): express.Express {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));

  // Static blog. Must come before the SPA catch-all.
  mountBlog(app, options.blogDist);

  // SPA assets.
  app.use('/blog-static', express.static(options.spaStatic));

  app.use('/api', apiRouter);

  // An unmatched API path must 404 as an API, not fall through to the SPA
  // shell — otherwise every deleted blog endpoint would still answer 200 with
  // a page of HTML, which is worse than being gone.
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'not found' });
  });

  // Everything else is a SPA route.
  app.get('*', (_req, res) => {
    res.sendFile(path.join(options.spaStatic, 'index.html'));
  });

  return app;
}

function start(): void {
  const config = serverConfig();
  const port = config.server.port;

  const app = createApp({
    blogDist: process.env.BLOG_DIST ?? '/usr/src/app/blog-dist',
    spaStatic: path.join(__dirname, '../static'),
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// `node dist/app.js` starts the server; importing the module does not.
if (require.main === module) {
  start();
}
