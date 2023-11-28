import { convert } from 'packages/md-to-html/marked';

export const update = async (): Promise<void> => {
  try {
    await convert();
  } catch (err) {
    console.log(err);
    throw err;
  }
};