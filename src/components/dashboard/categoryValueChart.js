import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#2e7d32', '#4caf50', '#81c784'];

const aggregateCategoryValue = (products, stock) => {
  const categories = {};
  stock.forEach(({ productId, quantity }) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      categories[product.category] = (categories[product.category] || 0) + quantity * product.unitCost;
    }
  });
  return Object.keys(categories).map(name => ({ name, value: categories[name] }));
};

export default function CategoryValueDonutChart() {
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
        const chartData = aggregateCategoryValue(products, stock);
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
          <Typography variant="h6">Category Value Distribution</Typography>
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
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Grid>
  );
}