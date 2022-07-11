import * as esbuild from 'esbuild-wasm';

import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

let service: esbuild.Service;

export interface BundlerReturnType {
  code: string;
  err: string;
}

const bundler = async (rawCode: string): Promise<BundlerReturnType> => {
  // Service is going to be used to bundle and transpile user's code

  // If service is not defined create the service
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      // Fetch the web assembly binary that is in the public directory
      // wasmURL: '/esbuild.wasm',
      // From the unpkg npm
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  }

  // ALSO SHOW THE BUNDLE ERRORS IN THE I_FRAME
  try {
    const result = await service.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      // Pass the user's code in the plugin
      // Order matters here
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      // Define environment variable
      define: {
        // If there is process.env.NODE_ENV, replace it with "production" (string not variable)
        'process.env.NODE_ENV': '"production"',
        // If there is global, replace it with window (variable not string)
        global: 'window',
      },
      jsxFactory: '_React.createElement',
      jsxFragment: '_React.Fragment',
    });

    // Build will transpile and bundle the files (bundle means to put all js files into one file)
    return { code: result.outputFiles[0].text, err: '' };
  } catch (err: any) {
    return { err: err.message as string, code: '' };
  }
};

export default bundler;
