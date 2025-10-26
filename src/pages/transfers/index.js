import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TransferForm from './transferForm';

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stock, setStock] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTransferId, setSelectedTransferId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch('/api/warehouses').then(res => res.json()),
      fetch('/api/transfers').then(res => res.json()),
      fetch('/api/stock').then(res => res.json()),
    ]).then(([productsData, warehousesData, transfersData, stockData]) => {
      setProducts(productsData);
      setWarehouses(warehousesData);
      setTransfers(transfersData);
      setStock(stockData);
    });
  };

  const handleClickOpen = (id) => {
    setSelectedTransferId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTransferId(null);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/transfers/${selectedTransferId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTransfers(transfers.filter((transfer) => transfer.id !== selectedTransferId));
        handleClose();
      }
    } catch (error) {
      console.error('Error deleting Transfer:', error);
    }
  };

  return (
    <>
      <TransferForm products={products} warehouses={warehouses} fetchData={fetchData} stock={stock} />
      <Container sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Transfer History
        </Typography>
      </Container>
      <Container sx={{ mt: 8, mb: 4, height: 'calc(100vh - 450px)', overflow: 'auto' }}>
        <TableContainer component={Paper} sx={{ overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>Source</strong></TableCell>
                <TableCell><strong>Destination</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transfers.map((transfer) => {
                const currentProduct = products?.filter(item => item.id === transfer.productId)[0];
                const originWarehouse = warehouses?.filter(item => item.id === transfer.fromWarehouseId)[0];
                const destinationWarehouse = warehouses?.filter(item => item.id === transfer.toWarehouseId)[0];
                return <TableRow key={transfer.id}>
                  <TableCell>{currentProduct?.name}</TableCell>
                  <TableCell>{originWarehouse?.name}</TableCell>
                  <TableCell>{destinationWarehouse?.name}</TableCell>
                  <TableCell>{transfer.quantity}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleClickOpen(transfer.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              })}
              {transfers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No Transfers available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Transfer</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this Transfer? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

