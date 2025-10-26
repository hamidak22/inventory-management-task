import fs from 'fs';
import path from 'path';

const productsFile = path.join(process.cwd(), 'data/products.json');
const stockFile = path.join(process.cwd(), 'data/stock.json');
const alertsFile = path.join(process.cwd(), 'data/alerts.json');

export default function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Read products and stock data
            const products = JSON.parse(fs.readFileSync(productsFile));
            const stock = JSON.parse(fs.readFileSync(stockFile));
            let alerts = [];

            // Load existing alerts
            if (fs.existsSync(alertsFile)) {
                alerts = JSON.parse(fs.readFileSync(alertsFile));
            }

            // Keep resolved alerts, update or generate new unresolved alerts
            const unresolvedAlerts = alerts.filter((alert) => !alert.resolved);
            const newAlerts = [];

            stock.forEach((stockItem) => {
                const product = products.find((p) => p.id === stockItem.productId);
                if (!product) return;

                const quantity = stockItem.quantity;
                const reorderPoint = product.reorderPoint || 50;
                const alertId = `${stockItem.productId}-${stockItem.warehouseId}`;

                // Skip if already resolved
                if (alerts.some((alert) => alert.id === alertId && alert.resolved)) {
                    return;
                }

                // Update or create alert for low stock
                const existingAlert = unresolvedAlerts.find((alert) => alert.id === alertId);
                if (existingAlert) {
                    existingAlert.status = quantity < 10 ? 'Critical' : quantity < 50 ? 'Low' : 'Adequate';
                    existingAlert.reorderAmount = reorderPoint - quantity;
                    existingAlert.createdAt = new Date().toISOString();
                } else if (quantity < 50) {
                    newAlerts.push({
                        id: alertId,
                        productId: stockItem.productId,
                        warehouseId: stockItem.warehouseId,
                        status: quantity < 10 ? 'Critical' : 'Low',
                        reorderAmount: reorderPoint - quantity,
                        quantity,
                        resolved: false,
                    });
                }
            });

            // Remove resolved alerts if stock is no longer low
            const updatedAlerts = alerts.filter((alert) => {
                if (alert.resolved) return true; // Keep resolved alerts
                const stockItem = stock.find(
                    (s) => s.productId === alert.productId && s.warehouseId === alert.warehouseId
                );
                return stockItem && stockItem.quantity < 50; // Keep unresolved low stock alerts
            });

            // Add new alerts
            updatedAlerts.push(...newAlerts);

            // Save updated alerts
            fs.writeFileSync(alertsFile, JSON.stringify(updatedAlerts, null, 2));

            // Return only unresolved alerts for display
            res.status(200).json(updatedAlerts.filter((alert) => !alert.resolved));
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch alerts' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}