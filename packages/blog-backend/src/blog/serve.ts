import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import * as path from 'path';
import { resolveLegacySlug } from './legacy-slugs';

/**
 * Mounts the statically built blog at /blog.
 *
 * Order matters: static files (and the explicit mount-root handler right
 * before them) first so a real page never pays for the redirect lookup,
 * then the legacy 301 map, then the blog's own 404 so an unknown /blog path
 * does not fall through to the SPA shell.
 */
export function mountBlog(app: express.Express, blogDist: string): void {
  // serve-static's `redirect: false` also disables its own directory-index
  // resolution at the mount root: to keep a bare "/blog" from redirecting to
  // "/blog/", it forces the internal lookup path to '', which skips index
  // resolution entirely and 404s (falling through via `next()`). Handle the
  // mount root explicitly so the list page still serves without a redirect.
  app.use('/blog', (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/') {
      res.sendFile(path.join(blogDist, 'index.html'));
      return;
    }
    next();
  });

  app.use(
    '/blog',
    express.static(blogDist, {
      // build.format: 'file' emits <slug>.html; this serves it at /blog/<slug>
      // with no trailing-slash redirect.
      extensions: ['html'],
      index: 'index.html',
      redirect: false,
    }),
  );

  app.use('/blog', (req: Request, res: Response, next: NextFunction) => {
    const target = resolveLegacySlug(req.path);
    if (target === undefined) {
      next();
      return;
    }
    res.redirect(301, target);
  });

  app.use('/blog', (req: Request, res: Response) => {
    res.status(404).sendFile(path.join(blogDist, '404.html'));
  });
}
