import { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    Alert,
    Snackbar,
    Container,
    Box,
} from '@mui/material';

export default function AlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const fetchData = () => {
        setLoading(true);
        Promise.all([
            fetch('/api/products').then(res => res.json()),
            fetch('/api/warehouses').then(res => res.json()),
            fetch('/api/alerts').then(res => res.json()),
        ]).then(([productsData, warehousesData, alertData]) => {
            setProducts(productsData);
            setWarehouses(warehousesData);
            setAlerts(alertData);
            setLoading(false);
        }).catch(({ error }) => setError(error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleResolve = async (alertId) => {
        try {
            const response = await fetch('/api/alerts/resolve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: alertId }),
            });
            if (!response.ok) throw new Error('Failed to resolve alert');
            setAlerts(alerts.map(a => (a.id === alertId ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a)));
            setSnackbar({ open: true, message: 'Alert resolved successfully', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: err.message, severity: 'error' });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const filteredAlerts = filter === 'All'
        ? alerts.filter(a => !a.resolved)
        : alerts.filter(a => a.status === filter && !a.resolved);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container sx={{ p: 2, bgcolor: '#f5f7f5', minHeight: '100vh' }}>
            <Paper sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" gutterBottom>Low Stock Alerts</Typography>
                    <Select value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ mb: 2 }}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Critical">Critical</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                    </Select>
                </Box>
                <TableContainer sx={{ maxHeight: 600, overflowY: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Product</strong></TableCell>
                                <TableCell><strong>Warehouse</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Current Quantity</strong></TableCell>
                                <TableCell><strong>Reorder Amount</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAlerts.map((alert) => {
                                const currentProduct = products.filter(item => item.id === alert.productId)[0];
                                const currentwarehouse = warehouses.filter(item => item.id === alert.warehouseId)[0];
                                return <TableRow key={alert.id}>
                                    <TableCell>{currentProduct?.name}</TableCell>
                                    <TableCell>{currentwarehouse?.name}</TableCell>
                                    <TableCell sx={{ color: alert.status === 'Critical' ? '#d32f2f' : '#f57c00' }}>
                                        {alert.status}
                                    </TableCell>
                                    <TableCell>{alert.quantity || 0}</TableCell>
                                    <TableCell>{alert.reorderAmount}</TableCell>
                                    <TableCell>
                                        {!alert.resolved && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleResolve(alert.id)}
                                                color="primary"
                                                sx={{ borderColor: '#2e7d32', color: '#2e7d32' }}
                                            >
                                                Resolve
                                            </Button>
                                        )}
                                        {alert.resolved && <Typography variant="caption">Resolved</Typography>}
                                    </TableCell>
                                </TableRow>
                            })}
                            {filteredAlerts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No alerts available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}