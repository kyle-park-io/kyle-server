import { type Request, type Response } from 'express';
import express from 'express';
import {
  blogListNumber,
  blogList,
  blogDetail,
  blogDownload,
} from '../services/blog';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { update } from '../utils/md';

const apiRouter = express.Router();

apiRouter.get('/blog/number', (req: Request, res: Response) => {
  void blogListNumber(req, res);
});
apiRouter.get('/blog/sorted-by-date/top-10', (req: Request, res: Response) => {
  void blogListNumber(req, res);
});
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
apiRouter.get('/blog/download/:id', (req: Request, res: Response) => {
  void blogDownload(req, res);
});

export default apiRouter;
