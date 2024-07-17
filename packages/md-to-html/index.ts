import { Marked } from 'marked';
import fs from 'fs';
import path from 'path';

export async function convert(): Promise<void> {
  try {
    const marked = new Marked();
    const markdownDirPath = path.resolve('md');
    const htmlOutputPath = path.resolve('html');

    if (!fs.existsSync(htmlOutputPath)) {
      fs.mkdirSync(htmlOutputPath, { recursive: true });
      console.log(`Folder created at: ${htmlOutputPath}`);
    } else {
      console.log(`Folder already exists at: ${htmlOutputPath}`);
    }

    const markdown = fs.readdirSync(markdownDirPath, 'utf8');
    sortedByModifiedTime(markdown);
    for (let i = 0; i < markdown.length; i++) {
      const file = fs.readFileSync(markdownDirPath + '/' + markdown[i], 'utf8');
      const html = await marked.parse(file);
      fs.writeFileSync(
        htmlOutputPath + '/' + markdown[i].split('.')[0] + '.html',
        html,
      );
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export function sortedByModifiedTime(files: string[]): void {
  try {
    const markdownDirPath = path.resolve('md');
    const sortDirPath = path.resolve('sort');
    if (!fs.existsSync(sortDirPath)) {
      fs.mkdirSync(sortDirPath, { recursive: true });
      console.log(`Folder created at: ${sortDirPath}`);
    } else {
      console.log(`Folder already exists at: ${sortDirPath}`);
    }

    const fileInfos = files.map((file) => {
      const filePath = path.join(markdownDirPath, file);
      const stats = fs.statSync(filePath);
      return {
        file: file,
        mtime: stats.mtime.getTime(),
      };
    });

    fileInfos.sort((a, b) => b.mtime - a.mtime);
    console.log(fileInfos);
    const sortedFiles = fileInfos.map((fileInfo) => fileInfo.file);
    fs.writeFileSync(
      sortDirPath + '/sorted-files.txt',
      JSON.stringify(sortedFiles),
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}
