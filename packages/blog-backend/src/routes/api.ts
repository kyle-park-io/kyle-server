import { type Request, type Response } from 'express';
import express from 'express';

const apiRouter = express.Router();

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true });
});

export default apiRouter;
