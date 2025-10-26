import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Autocomplete,
  Snackbar,
  Alert,
} from '@mui/material';

export default function TransferForm({ products, warehouses, stock, fetchData }) {
  const [transfer, setTransfer] = useState({
    productId: '',
    quantity: '',
    fromWarehouseId: '',
    toWarehouseId: '',
  });
  const [openSnackBar, setOpenSnackBar] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    const availableGoods = stock.filter(item => item.warehouseId === transfer.fromWarehouseId && item.productId === transfer.productId);
    const destinationWarehouse = stock.filter(item => item.warehouseId === transfer.toWarehouseId && item.productId === transfer.productId);

    if (!availableGoods[0]) {
      setOpenSnackBar('this product is not available in this warehouse.')
    } else if (availableGoods[0].quantity < transfer.quantity) {
      setOpenSnackBar('The amount you entered is more than warehouse quantity of this product.')
    } else {
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transfer),
      });
      if (res.ok) {
        const originWarehouseUpdateRes = await fetch(`/api/stock/${availableGoods[0]?.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: parseInt(transfer.productId),
            warehouseId: parseInt(transfer.fromWarehouseId),
            quantity: parseInt(availableGoods[0].quantity) - parseInt(transfer.quantity),
          }),
        });
        const destinationWarehouseupdateRes = await fetch(destinationWarehouse[0] ? `/api/stock/${destinationWarehouse[0]?.id}` : '/api/stock', {
          method: destinationWarehouse[0] ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: parseInt(transfer.productId),
            warehouseId: parseInt(transfer.toWarehouseId),
            quantity: parseInt((destinationWarehouse[0]?.quantity || 0)) + parseInt(transfer.quantity),
          }),
        });
        if (originWarehouseUpdateRes.ok && destinationWarehouseupdateRes.ok) {
          fetchData();
          setTransfer({
            productId: 0,
            quantity: '',
            fromWarehouseId: '',
            toWarehouseId: '',
          })
        }
      }
    }
  };

  return (
    <>
      <Container sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Add New Transfer
          </Typography>
          <Box gap={2} component="form" onSubmit={handleSubmit} noValidate>
            <Box display="flex" gap={4}>
              <Autocomplete
                fullWidth
                options={products || []}
                onChange={(e, newValue) => setTransfer({ ...transfer, productId: newValue?.id || 0 })}
                getOptionLabel={option =>
                  option.name
                }
                value={products.find(product => product.id === transfer.productId) || null}
                renderInput={(params) => <TextField
                  required {...params} label="Product" />}
              />
              <TextField
                required
                fullWidth
                label="Quantity"
                name="quantity"
                value={transfer.quantity}
                onChange={e => setTransfer({ ...transfer, quantity: e.target.value })}
              />
            </Box>
            <Box display="flex" gap={4} my={4}>
              <Autocomplete
                fullWidth
                options={warehouses || []}
                onChange={(e, newValue) => setTransfer({ ...transfer, fromWarehouseId: newValue?.id || 0 })}
                getOptionLabel={option =>
                  option.name
                }
                value={warehouses.find(warehouse => warehouse.id === transfer.fromWarehouseId) || null}
                renderInput={(params) => <TextField required {...params} label="Origin warehouse" />}
              />
              <Autocomplete
                fullWidth
                options={warehouses || []}
                onChange={(e, newValue) => setTransfer({ ...transfer, toWarehouseId: newValue?.id || 0 })}
                getOptionLabel={option =>
                  option.name
                }
                value={warehouses.find(warehouse => warehouse.id === transfer.toWarehouseId) || null}
                renderInput={(params) => <TextField required {...params} label="Destination warehouse" />}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  transfer.productId === '' ||
                  transfer.quantity === '' ||
                  transfer.fromWarehouseId === '' ||
                  transfer.toWarehouseId === ''
                }
              >
                Add Transfer
              </Button>
            </Box>
          </Box>
        </Paper>
        <Snackbar
          open={openSnackBar !== ''}
          autoHideDuration={6000}
          onClose={() => setOpenSnackBar('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={() => setOpenSnackBar('')} severity='error' sx={{ width: '100%' }}>
            {openSnackBar}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

