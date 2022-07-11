import * as esbuild from 'esbuild-wasm';

// This function returns plugin that can be plugged into esbuild
export const unpkgPathPlugin = () => {
  return {
    // "name" is just for debugging purposes
    name: 'unpkg-path-plugin',
    // "setup" will be called esbuild as pass build into it
    // this "build" represents the bundling process (the entire process of binding up files, loading it up, parsing it, transpile it, and join the bunch of files together)
    setup(build: esbuild.PluginBuild) {
      // onResolve EventHandler overrides esbuild natural process of resolving files (default is to figure out where the index.js file is stored)

      // Resolving the root file that we provided index.js
      build.onResolve(
        { filter: /(^index\.js$)/ },
        (args: esbuild.OnResolveArgs) => {
          // This index.js file is defined in index.tsx file
          // If the path is index.js file that will be the file name that we have provided in every code cell
          return { path: args.path, namespace: 'a' };
        }
      );

      // Resolving the relative path files that are provided by npm packages
      // This regex will find if we have ./ or ../ in args.path
      build.onResolve({ filter: /^\.+\// }, (args: esbuild.OnResolveArgs) => {
        return {
          namespace: 'a',
          // The second argument is the file that tries to import this thing
          // Make sure to provide forward slash, by providing forward slash, if args.path starts with "./", it will be joined to the end of string, if it starts with "../", it will join to the previous slash to the url (means move to the upper directory in a sense)
          path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
        };
      });

      // For npm libraries main files like (index.js or main.js or something like that)
      build.onResolve({ filter: /.*/ }, (args: esbuild.OnResolveArgs) => {
        // If we have file other than index.js file
        // IMPORTANT! In onResolve args.path is package name, but in onLoad args.path is package path on npm
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
