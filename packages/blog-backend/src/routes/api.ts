import express from 'express';
import { blogList, blogDetail } from '../services/blog';

const apiRouter = express.Router();

apiRouter.get('/blog', (req, res) => {
  void blogList(req, res);
});
apiRouter.get('/blog/:id', (req, res) => {
  void blogDetail(req, res);
});

export default apiRouter;
