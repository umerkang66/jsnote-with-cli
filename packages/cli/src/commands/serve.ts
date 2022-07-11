import path from 'path';
import { Command } from 'commander';
import { serve } from '@jsnote-umer/local-api';

export const serveCommand = new Command()
  // [] means optional, <> means required
  .command('serve [filename]')
  .description('Open a file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action(
    async (filename: string = 'notebook.js', options: { port: string }) => {
      try {
        // cwd is where node process runs, dirname is directories if user provided nested paths
        const dir = path.join(process.cwd(), path.dirname(filename));
        const extractedFilename = path.basename(filename);
        const isProduction = process.env.NODE_ENV === 'production';

        // jsnote serve is called, call the serve function from local-api
        await serve(
          parseInt(options.port),
          extractedFilename,
          dir,
          // use-proxy if it is not in production (in development)
          !isProduction
        );

        console.log(
          `Opened ${filename}. Navigate to http://localhost:${options.port}`
        );
      } catch (err: any) {
        if (err.code === 'EADDRINUSE') {
          console.error(
            `Error: port '${options.port}' is in use, try running on a different port by '-p' or '--port' flag`
          );
        } else {
          console.log('⚠⚠⚠', err.message);
        }

        process.exit(1);
      }
    }
  );
