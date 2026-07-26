import { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { PAGE_SIZE } from '../../constants/appConstants';
import {
  fetchSubShipments,
  clearSubShipments,
  fetchSubShipmentFormData,
  fetchSubShipmentStatuses,
  createSubShipment,
  updateSubShipment,
  updateSubShipmentStatusAction,
  uploadSubShipmentProof,
  removeSubShipmentProof,
  deleteSubShipment,
  uploadProof,
} from '../../actions/subShipmentsActions';

const EMPTY_FORM = {
  employeeId: '',
  clientId: '',
  subShipmentPlace: '',
  comment: '',
  proof: '',
  quantity: '',
  itemTypeId: '',
  commentForItemType: '',
  statusId: '',
};

function toDateInput(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString();
}

function SubShipments({ shipmentId, shipmentEmployeeId, readOnly = false, canChangeStatus = false }) {
  const dispatch = useDispatch();
  const subShipments = useSelector(state => state.subShipments.data);
  const loading = useSelector(state => state.subShipments.loading);
  const { users, itemTypes } = useSelector(state => state.subShipments.formData);
  const statuses = useSelector(state => state.subShipments.statuses);
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [uploadingProofId, setUploadingProofId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchSubShipments(shipmentId));
    if (!readOnly) dispatch(fetchSubShipmentFormData());
    else if (canChangeStatus) dispatch(fetchSubShipmentStatuses());
    return () => { dispatch(clearSubShipments()); };
  }, [shipmentId]);

  function openCreate() {
    document.activeElement?.blur();
    setEditingSub(null);
    setForm({ ...EMPTY_FORM, employeeId: shipmentEmployeeId || '', statusId: statuses[0]?.id || '' });
    setErrors({});
    setDialogOpen(true);
  }

  function openEdit(ss) {
    document.activeElement?.blur();
    const employee = users.find(u => u.email === ss.employee);
    const client = users.find(u => u.email === ss.client);
    const itemType = itemTypes.find(it => it.name === ss.itemType);
    const status = statuses.find(s => s.status === ss.status);
    setEditingSub(ss);
    setForm({
      employeeId: employee?.userId || '',
      clientId: client?.userId || '',
      subShipmentPlace: ss.subShipmentPlace,
      comment: ss.comment,
      proof: ss.proof || '',
      quantity: ss.quantity,
      itemTypeId: itemType?.id || '',
      commentForItemType: ss.commentForItemType,
      statusId: status?.id || '',
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingSub(null);
    setErrors({});
  }

  function field(key) {
    return e => setForm({ ...form, [key]: e.target.value });
  }

  async function handleProofUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingProof(true);
    const result = await dispatch(uploadProof(file));
    setUploadingProof(false);
    if (result?.path) setForm(f => ({ ...f, proof: result.path }));
  }

  async function handleSave() {
    const newErrors = {};
    if (!form.clientId) newErrors.clientId = 'Client is required.';
    if (!form.subShipmentPlace.trim()) newErrors.subShipmentPlace = 'Place is required.';
    if (!form.itemTypeId) newErrors.itemTypeId = 'Item type is required.';
    if (form.quantity === '' || Number(form.quantity) <= 0) newErrors.quantity = 'Quantity must be greater than 0.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 4000);
      return;
    }
    setErrors({});

    if (editingSub) {
      const employee = users.find(u => u.userId === form.employeeId);
      const client = users.find(u => u.userId === form.clientId);
      const itemType = itemTypes.find(it => it.id === form.itemTypeId);
      const status = statuses.find(s => s.id === form.statusId);

      const data = {
        employee: employee?.email || '',
        client: client?.email || '',
        street: form.subShipmentPlace,
        comment: form.comment,
        proof: form.proof,
        quantity: Number(form.quantity),
        itemType: itemType?.name || '',
        commentForItemType: form.commentForItemType,
        subShipmentStatus: status?.status || '',
      };

      const updated = await dispatch(updateSubShipment(editingSub.id, data));
      if (updated) closeDialog();
    } else {
      const data = {
        subShipment: {
          subShipmentPlace: form.subShipmentPlace,
          comment: form.comment,
          proof: form.proof,
          employee_id: form.employeeId,
          client_id: form.clientId,
          shipment_id: shipmentId,
          sub_shipment_status_id: form.statusId || null,
        },
        itemType: {
          id: form.itemTypeId,
          description: form.commentForItemType,
        },
      };

      const created = await dispatch(createSubShipment(form.quantity, data));
      if (created) {
        dispatch(fetchSubShipments(shipmentId));
        closeDialog();
      }
    }
  }

  async function handleStatusChange(subShipmentId, statusId) {
    await dispatch(updateSubShipmentStatusAction(subShipmentId, statusId));
    dispatch(fetchSubShipments(shipmentId));
  }

  async function handleRemoveProof(subShipmentId) {
    dispatch(removeSubShipmentProof(subShipmentId));
  }

  async function handleInlineProofUpload(subShipmentId, file) {
    if (!file) return;
    setUploadingProofId(subShipmentId);
    await dispatch(uploadSubShipmentProof(subShipmentId, file));
    setUploadingProofId(null);
    dispatch(fetchSubShipments(shipmentId));
  }

  async function handleDelete() {
    const success = await dispatch(deleteSubShipment(deleteConfirm.id));
    if (success) setDeleteConfirm(null);
  }

  const safePage = Math.min(page, Math.max(0, Math.ceil(subShipments.length / PAGE_SIZE) - 1));

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}><CircularProgress size={24} /></div>;

  return (
    <div style={{ padding: '1rem 2rem', backgroundColor: '#f9f9f9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <Typography variant="subtitle1"><strong>Sub-Shipments</strong></Typography>
        {!readOnly && <Button variant="contained" color="primary" size="small" onClick={openCreate}>Add</Button>}
      </div>

      {subShipments.length === 0 ? (
        <Typography variant="body2" color="textSecondary">No sub-shipments yet.</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Place</TableCell>
              <TableCell>Item Type</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Proof</TableCell>
              {!readOnly && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {subShipments.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE).map(ss => (
              <TableRow key={ss.id}>
                <TableCell>{ss.employee}</TableCell>
                <TableCell>{ss.client}</TableCell>
                <TableCell>{formatDate(ss.deliveryDate)}</TableCell>
                <TableCell>{ss.subShipmentPlace}</TableCell>
                <TableCell>{ss.itemType}</TableCell>
                <TableCell>{ss.quantity}</TableCell>
                <TableCell>
                  {canChangeStatus ? (
                    <Select
                      value={statuses.find(s => s.status === ss.status)?.id || ''}
                      onChange={e => handleStatusChange(ss.id, e.target.value)}
                      displayEmpty
                    >
                      {statuses.map(s => <MenuItem key={s.id} value={s.id}>{s.status}</MenuItem>)}
                    </Select>
                  ) : ss.status}
                </TableCell>
                <TableCell>
                  {ss.proof ? <a href={ss.proof} target="_blank" rel="noreferrer">View</a> : (!canChangeStatus && '—')}
                  {canChangeStatus && (
                    <div>
                      {ss.proof ? (
                        <Typography
                          variant="caption"
                          color="error"
                          style={{ textDecoration: 'underline', cursor: 'pointer' }}
                          onClick={() => handleRemoveProof(ss.id)}
                        >
                          Remove
                        </Typography>
                      ) : (
                        <label style={{ cursor: 'pointer' }}>
                          <Typography variant="caption" color="primary" style={{ textDecoration: 'underline' }}>
                            {uploadingProofId === ss.id ? 'Uploading...' : 'Upload'}
                          </Typography>
                          <input type="file" hidden disabled={uploadingProofId === ss.id} onChange={e => handleInlineProofUpload(ss.id, e.target.files[0])} />
                        </label>
                      )}
                    </div>
                  )}
                </TableCell>
                {!readOnly && (
                  <TableCell>
                    <IconButton size="small" onClick={() => openEdit(ss)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={e => { e.currentTarget.blur(); setDeleteConfirm(ss); }}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <TablePagination
        component="div"
        count={subShipments.length}
        page={safePage}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={PAGE_SIZE}
        rowsPerPageOptions={[]}
      />

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="md">
        <DialogTitle>{editingSub ? 'Edit Sub-Shipment' : 'Add Sub-Shipment'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal" variant="outlined" disabled>
                <InputLabel>Employee</InputLabel>
                <Select value={form.employeeId} label="Employee">
                  {users.map(u => <MenuItem key={u.userId} value={u.userId}>{u.fullName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.clientId}>
                <InputLabel>Client</InputLabel>
                <Select value={form.clientId} onChange={field('clientId')} label="Client">
                  <MenuItem value="">— None —</MenuItem>
                  {users.filter(u => u.userType === 3).map(u => <MenuItem key={u.userId} value={u.userId}>{u.fullName}</MenuItem>)}
                </Select>
                {errors.clientId && <Typography variant="caption" color="error" style={{ marginLeft: 14, marginTop: 4 }}>{errors.clientId}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField label="Place" fullWidth margin="normal" variant="outlined"
                value={form.subShipmentPlace} onChange={field('subShipmentPlace')}
                error={!!errors.subShipmentPlace} helperText={errors.subShipmentPlace} />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.itemTypeId}>
                <InputLabel>Item Type</InputLabel>
                <Select value={form.itemTypeId} onChange={field('itemTypeId')} label="Item Type">
                  <MenuItem value="">— None —</MenuItem>
                  {itemTypes.map(it => <MenuItem key={it.id} value={it.id}>{it.name}</MenuItem>)}
                </Select>
                {errors.itemTypeId && <Typography variant="caption" color="error" style={{ marginLeft: 14, marginTop: 4 }}>{errors.itemTypeId}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField label="Quantity" type="number" fullWidth margin="normal" variant="outlined"
                value={form.quantity} onChange={field('quantity')}
                error={!!errors.quantity} helperText={errors.quantity} />
            </Grid>
            {editingSub && (
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select value={form.statusId} onChange={field('statusId')} label="Status">
                    <MenuItem value="">— None —</MenuItem>
                    {statuses.map(s => <MenuItem key={s.id} value={s.id}>{s.status}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={6}>
              <TextField label="Item Type Description" fullWidth margin="normal" variant="outlined"
                value={form.commentForItemType} onChange={field('commentForItemType')} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Comment" fullWidth margin="normal" variant="outlined" multiline rows={2}
                value={form.comment} onChange={field('comment')} />
            </Grid>
            {editingSub && (
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>Proof</Typography>
                <input type="file" onChange={handleProofUpload} disabled={uploadingProof} />
                {uploadingProof && <Typography variant="caption"> Uploading...</Typography>}
                {form.proof && (
                  <>
                    <Typography variant="caption" style={{ marginLeft: 8 }}>{form.proof}</Typography>
                    <Button size="small" color="secondary" style={{ marginLeft: 8 }} onClick={() => setForm(f => ({ ...f, proof: '' }))}>Remove</Button>
                  </>
                )}
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained" disabled={uploadingProof}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Sub-Shipment</DialogTitle>
        <DialogContent>Are you sure you want to delete this sub-shipment?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SubShipments;
