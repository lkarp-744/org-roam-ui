import { readdirSync } from 'fs';
import withPlugins from 'next-compose-plugins';
import withTM from 'next-transpile-modules';

const d3packages = readdirSync('node_modules').filter((name) =>
  name.startsWith('d3-')
);

export default withPlugins([withTM(d3packages)], {
  //distDir: 'build',
  images: {
    domains: ['localhost'],
    loader: 'custom',
  },
  output: 'export',
});
