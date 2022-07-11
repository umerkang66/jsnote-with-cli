import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

// Creating the caching layer between requests that is going to be made to unpkg
const fileCache = localforage.createInstance({
  // Name is name of this DB (indexedDB)
  name: 'fileCache',
});

export const fetchPlugin = (userCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // this "eventHandler" will try to load that file
      // we can override the default load step, by providing the content here as string, esbuild will treat it as if the file is loaded from

      build.onLoad({ filter: /(^index\.js$)/ }, (args: esbuild.OnLoadArgs) => {
        // args.path is path that we provided on onResolve callback, here we can fetch the files from npm using that path

        // IMPORTANT! In onResolve args.path is package name, but in onLoad args.path is package path on npm
        return {
          loader: 'jsx',
          contents: userCode,
        };
      });

      // This is for caching if it got results, it will not go to the next handlers, if it didn't caught results, then it will go to the next handlers
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        // Check to see if we have already fetched this file, if it is return it immediately, otherwise allow the request to happen
        // Store the values using args.path as key, and the whole return object as value
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) return cachedResult;
      });

      build.onLoad({ filter: /.css$/ }, async (args: esbuild.OnLoadArgs) => {
        const { data, request } = await axios.get(args.path);

        // Manually inject the css into dom
        const contents = `
          const style = document.createElement('style');
          style.innerText = '${data
            // New lines have removed
            .replace(/\n/g, '')
            // Double quotes have removed
            .replace(/"/g, '\\"')
            // Single quotes have removed
            .replace(/'/g, "\\'")}';
          document.head.appendChild(style);
        `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          // It is going to be provided to the next file that we tried to require, in other words where we found nested package
          // Tell where we find the last file we are looking for
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // Then store result obj in cache
        await fileCache.setItem(args.path, result);
        return result;
      });

      // For .js files we are using it as catchAll
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          // It is going to be provided to the next file that we tried to require, in other words where we found nested package
          // Tell where we find the last file we are looking for
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // Then store result obj in cache
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
