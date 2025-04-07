import fs from 'fs';

export default async function handler(req: any, res: any) {
  const { slug } = req.query;

  try {
    const text = fs.readFileSync(`${decodeURIComponent(slug)}`, {
      encoding: 'utf-8',
    });
    res.end(`${text}`);
  } catch (e) {
    res.end(`There was an error: ${e}`);
    console.error(e);
  }
}
