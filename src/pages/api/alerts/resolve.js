import fs from 'fs';
import path from 'path';

const alertsFile = path.join(process.cwd(), 'data/alerts.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Alert ID is required' });
      }

      // Read current alerts
      let alerts = [];
      if (fs.existsSync(alertsFile)) {
        alerts = JSON.parse(fs.readFileSync(alertsFile));
      }

      // Find and update the alert
      const alert = alerts.find((a) => a.id === id);
      if (!alert) {
        return res.status(404).json({ error: 'Alert not found' });
      }

      alert.resolved = true;

      // Save updated alerts
      fs.writeFileSync(alertsFile, JSON.stringify(alerts, null, 2));

      res.status(200).json({ message: 'Alert resolved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to resolve alert' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}