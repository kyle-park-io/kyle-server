// import { convert } from 'md-to-html/marked';
import { convert } from 'md-to-html3';

export const update = async (): Promise<void> => {
  try {
    await convert();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
