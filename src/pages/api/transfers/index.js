import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'transfers.json');
  const jsonData = fs.readFileSync(filePath);
  let transfers = JSON.parse(jsonData);

  if (req.method === 'GET') {
    res.status(200).json(transfers);
  } else if (req.method === 'POST') {
    const newWarehouse = req.body;
    newWarehouse.id = transfers.length ? Math.max(...transfers.map(w => w.id)) + 1 : 1;
    transfers.push(newWarehouse);
    fs.writeFileSync(filePath, JSON.stringify(transfers, null, 2));
    res.status(201).json(newWarehouse);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

