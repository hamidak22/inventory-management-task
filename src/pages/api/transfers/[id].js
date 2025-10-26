import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { id } = req.query;
  const filePath = path.join(process.cwd(), 'data', 'transfers.json');
  const jsonData = fs.readFileSync(filePath);
  let transfers = JSON.parse(jsonData);

  if (req.method === 'GET') {
    const Transfer = transfers.find((w) => w.id === parseInt(id));
    if (Transfer) {
      res.status(200).json(Transfer);
    } else {
      res.status(404).json({ message: 'Transfer not found' });
    }
  } else if (req.method === 'DELETE') {
    const index = transfers.findIndex((w) => w.id === parseInt(id));
    if (index !== -1) {
      transfers.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(transfers, null, 2));
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Transfer not found' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

