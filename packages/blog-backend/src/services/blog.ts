import { type Request, type Response } from 'express';
import fs from 'fs';
import * as path from 'path';

export const blogListNumber = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const htmlOutputPath = path.join('/usr/src/app/html');
    const list = fs.readdirSync(htmlOutputPath, 'utf8');
    res.json(list.length);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      res.status(500).send(err.message);
    } else {
      console.error('An unexpected error occurred:', err);
      res.status(500).send(new Error('An unexpected error occurred'));
    }
  }
};

export const blogGetTop10SortedByDate = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const htmlOutputPath = path.join('/usr/src/app/html');
    const list = fs.readdirSync(htmlOutputPath, 'utf8');
    const result: string[] = [];
    for (let i = 0; i < list.length; i++) {
      result.push(list[i].split('.')[0]);
    }
    res.json(result);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      res.status(500).send(err.message);
    } else {
      console.error('An unexpected error occurred:', err);
      res.status(500).send(new Error('An unexpected error occurred'));
    }
  }
};

export const blogList = async (req: Request, res: Response): Promise<any> => {
  try {
    const htmlOutputPath = path.join('/usr/src/app/html');
    const list = fs.readdirSync(htmlOutputPath, 'utf8');
    const result: string[] = [];
    for (let i = 0; i < list.length; i++) {
      result.push(list[i].split('.')[0]);
    }
    res.json(result);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      res.status(500).send(err.message);
    } else {
      console.error('An unexpected error occurred:', err);
      res.status(500).send(new Error('An unexpected error occurred'));
    }
  }
};

export const blogDetail = async (req: Request, res: Response): Promise<any> => {
  try {
    const exist = fs.existsSync(`/usr/src/app/html/${req.params.id}.html`);
    if (!exist) {
      const obj = { exist: false };
      return res.json(obj);
    }

    const detail = fs.readFileSync(
      `/usr/src/app/html/${req.params.id}.html`,
      'utf8',
    );
    const obj = { exist: true, test: 'test', detail };
    return res.json(obj);
    // res.send(test);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      res.status(500).send(err.message);
    } else {
      console.error('An unexpected error occurred:', err);
      res.status(500).send(new Error('An unexpected error occurred'));
    }
  }
};

export const blogDownload = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const exist = fs.existsSync(`/usr/src/app/html/${req.params.id}.html`);
    if (!exist) {
      const obj = { exist: false };
      return res.json(obj);
    }

    res.download(`/usr/src/app/md/${req.params.id}.md`, (err) => {
      if (err) {
        res.status(404).send(`${req.params.id} not found`);
      }
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      res.status(500).send(err.message);
    } else {
      console.error('An unexpected error occurred:', err);
      res.status(500).send(new Error('An unexpected error occurred'));
    }
  }
};
