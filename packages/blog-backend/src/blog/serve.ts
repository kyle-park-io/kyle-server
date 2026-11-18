import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import { existsSync } from 'fs';
import * as path from 'path';
import { resolveLegacySlug } from './legacy-slugs';
import { chooseList, LANG_COOKIE } from './lang';

/**
 * Mounts the statically built blog at /blog.
 *
 * Order matters: static files (and the explicit mount-root handler right
 * before them) first so a real page never pays for the redirect lookup,
 * then the legacy 301 map, then the blog's own 404 so an unknown /blog path
 * does not fall through to the SPA shell.
 */

/**
 * build-blog.sh publishes atomically via two renames (old BLOG_DIST ->
 * .old, then .new -> BLOG_DIST), and there is a real, if brief, window
 * between them where nothing exists at BLOG_DIST. `res.sendFile` with no
 * error callback funnels that ENOENT into `send`, which sets status 404 --
 * indistinguishable from the page genuinely not existing. That's worse than
 * a bare 500 would be: a crawler that gets a 404 for /blog or a real post
 * during the swap window treats it as gone and risks deindexing it, where a
 * transient signal would make it back off and retry. Treat a missing file
 * here as "publishing right now, try again in a moment" (503 + Retry-After)
 * instead: the window is as long as a directory rename, so a retry a second
 * later succeeds, and 503 + Retry-After is exactly the signal a crawler is
 * expected to retry on. Any other error (permissions, etc.) still goes to
 * `next(err)` so it hits the real error handler.
 */
function sendBlogFile(
  res: Response,
  next: NextFunction,
  filePath: string,
): void {
  res.sendFile(filePath, (err?: NodeJS.ErrnoException) => {
    if (!err) return;
    if (res.headersSent) {
      next(err);
      return;
    }
    if (err.code === 'ENOENT') {
      res
        .status(503)
        .set('Retry-After', '1')
        .type('text/plain')
        .send('blog is publishing a new build; try again in a moment');
      return;
    }
    next(err);
  });
}

export function mountBlog(app: express.Express, blogDist: string): void {
  // serve-static's `redirect: false` also disables its own directory-index
  // resolution at the mount root: to keep a bare "/blog" from redirecting to
  // "/blog/", it forces the internal lookup path to '', which skips index
  // resolution entirely and 404s. Handle the mount root explicitly so the
  // list page still serves without a redirect.
  //
  // `app.get` rather than `app.use`: this route pattern only ever matches
  // the exact path "/blog" (Express's non-strict routing treats "/blog" and
  // "/blog/" the same), so unlike `app.use` — which runs for every HTTP
  // method — a POST (or anything but GET/HEAD) to /blog now falls through
  // to the 404 handler below instead of getting a 200 with the list page.
  //
  // This is also the one address that picks a language: the Korean list is
  // served here, the English one is a redirect to /blog/en. lang.ts has the
  // order (?lang, cookie, Accept-Language) and why a request with no
  // Accept-Language gets Korean. The answer depends on two request headers,
  // so every response says so in Vary and is kept out of shared caches.
  app.get('/blog', (req: Request, res: Response, next: NextFunction) => {
    res.set('Vary', 'Accept-Language, Cookie');
    res.set('Cache-Control', 'private, no-cache');

    const choice = chooseList({
      query: req.query.lang,
      cookie: req.get('cookie'),
      acceptLanguage: req.get('accept-language'),
    });

    if (choice.kind === 'set') {
      res.cookie(LANG_COOKIE, choice.lang, {
        path: '/blog',
        maxAge: 31_536_000_000,
        sameSite: 'lax',
        secure: true,
      });
    }
    if (choice.kind === 'set' || choice.lang === 'en') {
      res.redirect(302, choice.lang === 'en' ? '/blog/en' : '/blog');
      return;
    }
    sendBlogFile(res, next, path.join(blogDist, 'index.html'));
  });

  // The English list is en.html, but once there are English tag pages
  // dist/en is also a directory. send 0.19.0 (under serve-static 1.16.2)
  // stats the path, finds a directory and goes to its redirect handler
  // before it ever tries the `.html` extension (node_modules/send/index.js
  // line 722), and `redirect: false` turns that into a 404. So, like the
  // mount root above, /blog/en is served explicitly. It is never redirected
  // by language: a link to the English list opens the English list.
  app.get('/blog/en', (_req: Request, res: Response, next: NextFunction) => {
    sendBlogFile(res, next, path.join(blogDist, 'en.html'));
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

  // Before the lists split by language every tag page lived at
  // /blog/tags/<tag>, and those addresses are in search indexes and the old
  // sitemap. A tag that only English posts use has no Korean page now, so
  // its old address forwards to the English one. Reaching this handler means
  // express.static found no Korean page for the path.
  app.use('/blog', (req: Request, res: Response, next: NextFunction) => {
    const match = /^\/tags\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(req.path);
    if (
      match &&
      existsSync(path.join(blogDist, 'en', 'tags', `${match[1]}.html`))
    ) {
      res.redirect(301, `/blog/en/tags/${match[1]}`);
      return;
    }
    next();
  });

  app.use('/blog', (req: Request, res: Response, next: NextFunction) => {
    const target = resolveLegacySlug(req.path);
    if (target === undefined) {
      next();
      return;
    }
    res.redirect(301, target);
  });

  app.use('/blog', (req: Request, res: Response, next: NextFunction) => {
    res.status(404);
    sendBlogFile(res, next, path.join(blogDist, '404.html'));
  });
}
