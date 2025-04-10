import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['pages/index.tsx'],
  bundle: true,
  minify: true,
  sourcemap: false,
  target: ['es2022', 'chrome126', 'firefox126', 'safari18', 'edge133'],
  outfile: './public/index.js',
  loader: {
    '.woff': 'text',
    '.ttf': 'text',
    '.woff2': 'text',
  },
});
