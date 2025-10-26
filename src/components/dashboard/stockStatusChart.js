import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#d32f2f', '#f57c00', '#2e7d32', '#0288d1'];

const aggregateStockStatus = (products, stock) => {
  const statusCounts = { Critical: 0, Low: 0, Adequate: 0, Overstocked: 0 };
  stock.forEach(({ productId, quantity }) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const status =
        quantity < 10
          ? 'Critical'
          : quantity < 50
          ? 'Low'
          : quantity <= product.reorderPoint
          ? 'Adequate'
          : 'Overstocked';
      statusCounts[status]++;
    }
  });
  return [
    { name: 'Critical', value: statusCounts.Critical },
    { name: 'Low', value: statusCounts.Low },
    { name: 'Adequate', value: statusCounts.Adequate },
    { name: 'Overstocked', value: statusCounts.Overstocked },
  ];
};

export default function StockStatusDonutChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, stockRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/stock'),
        ]);
        const products = await productsRes.json();
        const stock = await stockRes.json();
        const chartData = aggregateStockStatus(products, stock);
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
          <Typography variant="h6">Stock Status Distribution</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} products`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Grid>
  );
}