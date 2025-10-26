import fs from 'fs';
import path from 'path';

const generateAlerts = (products, stock, warehouses) => {
  const alerts = [];
  stock.forEach(({ productId, warehouseId, quantity }) => {
    const product = products.find(p => p.id === productId);
    const warehouse = warehouses.find(w => w.id === warehouseId);
    if (product && warehouse) {
      let status = 'Adequate';
      if (quantity < 10) status = 'Critical';
      else if (quantity < 50) status = 'Low';
      else if (quantity > product.reorderPoint) status = 'Overstocked';
      if (status === 'Critical' || status === 'Low') {
        alerts.push({
          id: `${productId}-${warehouseId}`,
          productId,
          warehouseId,
          status,
          reorderAmount: product.reorderPoint - quantity,
          quantity,
          resolved: false,
        });
      }
    }
  });
  return alerts;
};

export default function handler(req, res) {
  const alertsFile = path.join(process.cwd(), 'data/alerts.json');
  const productsFile = path.join(process.cwd(), 'data/products.json');
  const stockFile = path.join(process.cwd(), 'data/stock.json');
  const warehousesFile = path.join(process.cwd(), 'data/warehouses.json');

  if (req.method === 'GET') {
    try {
      const products = JSON.parse(fs.readFileSync(productsFile));
      const stock = JSON.parse(fs.readFileSync(stockFile));
      const warehouses = JSON.parse(fs.readFileSync(warehousesFile));
      const existingAlerts = fs.existsSync(alertsFile) ? JSON.parse(fs.readFileSync(alertsFile)) : [];
      
      const newAlerts = generateAlerts(products, stock, warehouses).filter(
        newAlert => !existingAlerts.some(existing => existing.id === newAlert.id && existing.resolved)
      );
      
      const allAlerts = [
        ...existingAlerts,
        ...newAlerts.filter(newAlert => !existingAlerts.some(existing => existing.id === newAlert.id))
      ];
      
      fs.writeFileSync(alertsFile, JSON.stringify(allAlerts, null, 2));
      res.status(200).json(allAlerts);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load alerts' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}