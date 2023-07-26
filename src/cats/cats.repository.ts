import { readFile, writeFile } from 'fs/promises';

export class CatsRepository {
  async findOne(id: number) {
    const catsContent = await readFile('cats.json', 'utf8');
    const cats = JSON.parse(catsContent);
    return cats[id];
  }

  async findAll() {
    const catsContent = await readFile('cats.json', 'utf8');
    return JSON.parse(catsContent);
  }

  async create(name: string) {
    const catsContent = await readFile('cats.json', 'utf8');
    const cats = JSON.parse(catsContent);

    const id = Object.keys(cats).length;
    cats[id] = {
      name: name,
      id: id,
    };
    await writeFile('cats.json', JSON.stringify(cats));
  }
}
