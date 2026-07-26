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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../actions/usersActions';
import { PAGE_SIZE } from '../../constants/appConstants';

const USER_TYPE_LABELS = { 1: 'Employee', 2: 'Admin', 3: 'Client' };
const EMPTY_FORM = { fullName: '', email: '', userType: 1, cellPhone: '' };

function Users() {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.data);
  const currentUserId = useSelector(state => state.auth.userId);
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { dispatch(fetchUsers()); }, []);

  if (users === null) return <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><CircularProgress /></div>;

  function openCreate() {
    document.activeElement?.blur();
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(user) {
    document.activeElement?.blur();
    setEditingUser(user);
    setForm({ fullName: user.fullName, email: user.email, userType: user.userType, cellPhone: user.cellPhone || '' });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingUser(null);
  }

  async function handleSave() {
    if (editingUser) {
      const updateData = { fullName: form.fullName, userType: form.userType };
      if (form.cellPhone) updateData.cellPhone = form.cellPhone;
      const updated = await dispatch(updateUser(editingUser.userId, updateData));
      if (updated) closeDialog();
    } else {
      const createData = { fullName: form.fullName, email: form.email, userType: form.userType };
      if (form.cellPhone) createData.cellPhone = form.cellPhone;
      const created = await dispatch(createUser(createData));
      if (created) closeDialog();
    }
  }

  async function handleDelete() {
    const success = await dispatch(deleteUser(deleteConfirm.userId));
    if (success) setDeleteConfirm(null);
  }

  const safePage = Math.min(page, Math.max(0, Math.ceil(users.length / PAGE_SIZE) - 1));
  const pagedUsers = users.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Users</h3>
        <Button variant="contained" color="primary" onClick={openCreate}>Add</Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length === 0 && (
            <TableRow><TableCell colSpan={5} align="center" style={{ color: '#888', padding: '2rem' }}>No users found.</TableCell></TableRow>
          )}
          {pagedUsers.map(user => (
            <TableRow key={user.userId}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{USER_TYPE_LABELS[user.userType] || user.userType}</TableCell>
              <TableCell>{user.cellPhone || '—'}</TableCell>
              <TableCell>
                <IconButton size="small" onClick={() => openEdit(user)}><EditIcon /></IconButton>
                {user.userId !== currentUserId && (
                  <IconButton size="small" onClick={e => { e.currentTarget.blur(); setDeleteConfirm(user); }}><DeleteIcon /></IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={users.length}
        page={safePage}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={PAGE_SIZE}
        rowsPerPageOptions={[]}
      />

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingUser ? 'Edit User' : 'Create User'}</DialogTitle>
        <DialogContent>
          <TextField label="Full Name" fullWidth margin="normal" variant="outlined"
            value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
          {!editingUser && (
            <TextField label="Email" fullWidth margin="normal" variant="outlined"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          )}
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>User Type</InputLabel>
            <Select value={form.userType} onChange={e => setForm({ ...form, userType: e.target.value })} label="User Type">
              <MenuItem value={1}>Employee</MenuItem>
              <MenuItem value={2}>Admin</MenuItem>
              <MenuItem value={3}>Client</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Phone" fullWidth margin="normal" variant="outlined"
            value={form.cellPhone} onChange={e => setForm({ ...form, cellPhone: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>Are you sure you want to delete <strong>{deleteConfirm?.fullName}</strong>?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Users;
