import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());
  const fullPath = path.join(dir, filename);

  router.get('/', async (req, res) => {
    try {
      // Read file
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });

      res.send(JSON.parse(result));
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        // if there is an error, file doesn't exist create one, and add default cells
        await fs.writeFile(fullPath, '[]', 'utf-8');
        res.send([]);
      } else {
        // This is some other error
        throw err;
      }
    }
  });

  router.post('/', async (req, res) => {
    // Take the list of cells from the request obj
    const { cells }: { cells: Cell[] } = req.body;
    // Write the cells into the file
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.send({ status: 'ok' });
  });

  return router;
};
