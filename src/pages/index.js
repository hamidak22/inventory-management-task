import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  useMediaQuery,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import CategoryIcon from '@mui/icons-material/Category';
import StockStatusDonutChart from '@/components/dashboard/stockStatusChart';
import StockByWarehouseChart from '@/components/dashboard/stockByWarehouseCharts';
import CategoryValueDonutChart from '@/components/dashboard/categoryValueChart';
import theme from '@/styles/theme';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stock, setStock] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Fetch all data
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch('/api/warehouses').then(res => res.json()),
      fetch('/api/stock').then(res => res.json()),
      fetch('/api/alerts').then(res => res.json()),
    ]).then(([productsData, warehousesData, stockData, alertsData]) => {
      setProducts(productsData);
      setWarehouses(warehousesData);
      setStock(stockData);
      setAlerts(alertsData.filter(item => !item.resolved))
    });
  }, []);

  // Calculate total inventory value
  const totalValue = stock.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.unitCost * item.quantity : 0);
  }, 0);

  // Get products with stock across all warehouses
  const inventoryOverview = products.map(product => {
    const productStock = stock.filter(s => s.productId === product.id);
    const totalQuantity = productStock.reduce((sum, s) => sum + s.quantity, 0);
    return {
      ...product,
      totalQuantity,
      isLowStock: totalQuantity < product.reorderPoint,
    };
  });


  return (
    <>
      <Container sx={{ mt: isMobile ? 20 : 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: theme.palette.secondary.light, boxShadow: `0px 0px 0px 2px ${theme.palette.success.A100}, 0px 1px 2px 0px ${theme.palette.success.A100}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Total Inventory Value</Typography>
                </Box>
                <Typography variant="h4">${totalValue.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: theme.palette.secondary.light, boxShadow: `0px 0px 0px 2px ${theme.palette.success.A100}, 0px 1px 2px 0px ${theme.palette.success.A100}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WarehouseIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Warehouses</Typography>
                </Box>
                <Typography variant="h4">{warehouses.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: theme.palette.secondary.light, boxShadow: `0px 0px 0px 2px ${theme.palette.success.A100}, 0px 1px 2px 0px ${theme.palette.success.A100}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Total Products</Typography>
                </Box>
                <Typography variant="h4">{products.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <StockStatusDonutChart />
          <CategoryValueDonutChart />
          <StockByWarehouseChart /><Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', backgroundColor: alerts.length > 0 ? theme.palette.warning.light : theme.palette.secondary.light, boxShadow: `0px 0px 0px 2px ${theme.palette.success.A100}, 0px 1px 2px 0px ${theme.palette.success.A100}` }}>
              <CardContent sx={{ display: 'flex', flexDirection: "column", height: '100%', justifyContent: "space-between" }} height="100%">
                <Typography variant="h6">Low Stock Alerts</Typography>
                <Box p={5} height="100%">
                  <Box display="flex" justifyContent="space-between" mb={2} pb={2} borderBottom="1px dashed grey">
                    <Box>Product</Box>
                    <Box>Quantity</Box>
                  </Box>
                  {alerts.length > 0 ? <>
                    {alerts.map(alert => {
                      const currentProduct = products.filter(item => item.id === alert.productId)[0];
                      return <Box display="flex" justifyContent="space-between" key={alert.id}>
                        <Box>{currentProduct.name}</Box>
                        <Box color={alert.status === 'Critical' ? theme.palette.error.dark : theme.palette.info.dark}>{alert.quantity}</Box>
                      </Box>
                    })}</> : 'There is no unresolved Alert.'}
                </Box>
                <Button href="/alerts" color="primary">View Alerts</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Inventory Overview Table */}
        <Typography variant="h5" gutterBottom>
          Inventory Overview
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>SKU</strong></TableCell>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell align="right"><strong>Total Stock</strong></TableCell>
                <TableCell align="right"><strong>Reorder Point</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryOverview.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    backgroundColor: item.isLowStock ? '#fff3e0' : 'inherit'
                  }}
                >
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="right">{item.totalQuantity}</TableCell>
                  <TableCell align="right">{item.reorderPoint}</TableCell>
                  <TableCell>
                    {item.isLowStock ? (
                      <Typography color="warning.main" fontWeight="bold">
                        Low Stock
                      </Typography>
                    ) : (
                      <Typography color="success.main">
                        In Stock
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}

