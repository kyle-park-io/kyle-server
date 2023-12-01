import { type Request, type Response } from 'express';
import express from 'express';
import { blogList, blogDetail } from '../services/blog';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { update } from '../utils/md';

const apiRouter = express.Router();

apiRouter.get('/blog', (req: Request, res: Response) => {
  void blogList(req, res);
});
apiRouter.get('/blog/update', (req: Request, res: Response) => {
  void update();
  res.json('');
});
apiRouter.get('/blog/:id', (req: Request, res: Response) => {
  void blogDetail(req, res);
});

export default apiRouter;
