import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const aggregateStockByWarehouse = (stock) => {
  const warehouseTotals = {};
  stock.forEach(({ warehouseId, quantity }) => {
    warehouseTotals[warehouseId] = (warehouseTotals[warehouseId] || 0) + quantity;
  });
  return Object.keys(warehouseTotals).map(id => ({
    warehouse: `Warehouse ${id}`,
    quantity: warehouseTotals[id],
  }));
};

export default function StockByWarehouseChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockRes = await fetch('/api/stock');
        const stock = await stockRes.json();
        const chartData = aggregateStockByWarehouse(stock);
        setData(chartData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          <Typography variant="h6">Stock by Warehouse</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis dataKey="warehouse" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => `${value} units`} />
              <Bar dataKey="quantity" fill="#2e7d32" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Grid>
  );
}