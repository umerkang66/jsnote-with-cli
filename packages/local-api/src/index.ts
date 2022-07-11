import path from 'path';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createCellsRouter } from './routes/cells';

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
): Promise<void> => {
  // this function is imported and run in "command" file of cli
  const app = express();

  app.use('/cells', createCellsRouter(filename, dir));

  if (useProxy) {
    // DEVELOPMENT
    app.use(
      createProxyMiddleware({
        target: 'http://localhost:3000',
        ws: true,
        logLevel: 'silent',
      })
    );
  } else {
    // PRODUCTION
    // resolve the path of shortcut folder to its original path, this is the absolute path of my machine to get to that index.html
    // if there is no more symbolic link, this will find the directory inside of our node_modules directory
    const pkgPath = path.resolve('@jsnote-umer/local-client/build/index.html');

    // we don't want entire path, we just want the directory of index.html file
    app.use(express.static(path.dirname(pkgPath)));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};
