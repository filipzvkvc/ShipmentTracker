import { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { fetchItemTypes, createItemType, updateItemType, deleteItemType } from '../../actions/itemTypesActions';
import { PAGE_SIZE } from '../../constants/appConstants';

const EMPTY_FORM = { name: '' };

function ItemTypes() {
  const dispatch = useDispatch();
  const itemTypes = useSelector(state => state.itemTypes.data);
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [nameError, setNameError] = useState('');

  useEffect(() => { dispatch(fetchItemTypes()); }, []);

  if (itemTypes === null) return <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><CircularProgress /></div>;

  function openCreate() {
    document.activeElement?.blur();
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(item) {
    document.activeElement?.blur();
    setEditingItem(item);
    setForm({ name: item.name });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingItem(null);
    setNameError('');
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setNameError('Item type name is required.');
      setTimeout(() => setNameError(''), 4000);
      return;
    }
    const data = editingItem ? { name: form.name } : { name: form.name, number_of_sold_items: 0 };
    if (editingItem) {
      const updated = await dispatch(updateItemType(editingItem.id, data));
      if (updated) closeDialog();
    } else {
      const created = await dispatch(createItemType(data));
      if (created) closeDialog();
    }
  }

  async function handleDelete() {
    const success = await dispatch(deleteItemType(deleteConfirm.id));
    if (success) setDeleteConfirm(null);
  }

  const safePage = Math.min(page, Math.max(0, Math.ceil(itemTypes.length / PAGE_SIZE) - 1));
  const pagedItemTypes = itemTypes.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Item Types</h3>
        <Button variant="contained" color="primary" onClick={openCreate}>Add</Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Units Sold</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {itemTypes.length === 0 && (
            <TableRow><TableCell colSpan={3} align="center" style={{ color: '#888', padding: '2rem' }}>No item types found.</TableCell></TableRow>
          )}
          {pagedItemTypes.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.number_of_sold_items}</TableCell>
              <TableCell>
                <IconButton size="small" onClick={() => openEdit(item)}><EditIcon /></IconButton>
                <IconButton size="small" onClick={e => { e.currentTarget.blur(); setDeleteConfirm(item); }}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={itemTypes.length}
        page={safePage}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={PAGE_SIZE}
        rowsPerPageOptions={[]}
      />

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle>{editingItem ? 'Edit Item Type' : 'Add Item Type'}</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" variant="outlined"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            error={!!nameError} helperText={nameError} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Item Type</DialogTitle>
        <DialogContent>Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ItemTypes;
