import { convert } from 'md-to-html3/index';

export const update = async (): Promise<void> => {
  try {
    await convert();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
