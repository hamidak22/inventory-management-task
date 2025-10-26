import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const alertsFile = path.join(process.cwd(), 'data/alerts.json');

  if (req.method === 'POST') {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Alert ID is required' });
      }

      const alerts = JSON.parse(fs.readFileSync(alertsFile));
      const alert = alerts.find(a => a.id === id);
      if (!alert) {
        return res.status(404).json({ error: 'Alert not found' });
      }

      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
      fs.writeFileSync(alertsFile, JSON.stringify(alerts, null, 2));
      res.status(200).json({ message: 'Alert resolved successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to resolve alert' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}