import { type Request, type Response } from 'express';
import fs from 'fs';
import * as path from 'path';

export const blogList = async (req: Request, res: Response): Promise<any> => {
  try {
    const htmlOutputPath = path.join('/usr/src/app/src/marked/html');
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
    const detail = fs.readFileSync(
      `/usr/src/app/src/marked/html/${req.params.id}.html`,
      'utf8',
    );
    const obj = { test: 'test', detail };
    res.json(obj);
    // res.send(test);
    return '';
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
