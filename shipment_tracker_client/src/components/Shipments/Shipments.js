import React, { useState, useEffect } from 'react';
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
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import TablePagination from '@material-ui/core/TablePagination';
import { PAGE_SIZE } from '../../constants/appConstants';
import { fetchShipments, fetchShipmentStatuses, createShipment, updateShipment, deleteShipment } from '../../actions/shipmentsActions';
import { fetchUsers } from '../../actions/usersActions';
import { fetchCountries } from '../../actions/countriesActions';
import { fetchSubShipments } from '../../actions/subShipmentsActions';
import SubShipments from './SubShipments';

const EMPTY_FORM = {
  departureDate: '',
  arrivalDate: '',
  arrivalPlace: '',
  returningDate: '',
  returningPlace: '',
  cargoTicketPrice: '',
  ticketPrice: '',
  comment: '',
  employee_id: '',
  shipment_status_id: '',
  country_id: '',
};

function toDateInput(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString();
}

function Shipments() {
  const dispatch = useDispatch();
  const shipments = useSelector(state => state.shipments.data);
  const loading = useSelector(state => state.shipments.loading);
  const allUsers = useSelector(state => state.users.data);
  const allCountries = useSelector(state => state.countries.data);
  const statuses = useSelector(state => state.shipments.statuses);
  const employees = allUsers ? allUsers.filter(u => u.userType === 1) : [];
  const countries = allCountries || [];
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchShipments());
    dispatch(fetchUsers());
    dispatch(fetchCountries());
    dispatch(fetchShipmentStatuses());
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><CircularProgress /></div>;

  function openCreate() {
    document.activeElement?.blur();
    setEditingShipment(null);
    const preparingStatus = statuses.find(s => s.status === 'PREPARING');
    setForm({ ...EMPTY_FORM, shipment_status_id: preparingStatus?.id || '' });
    setErrors({});
    setDialogOpen(true);
  }

  function openEdit(shipment) {
    document.activeElement?.blur();
    setEditingShipment(shipment);
    setForm({
      departureDate: toDateInput(shipment.departureDate),
      arrivalDate: toDateInput(shipment.arrivalDate),
      arrivalPlace: shipment.arrivalPlace,
      returningDate: toDateInput(shipment.returningDate),
      returningPlace: shipment.returningPlace,
      cargoTicketPrice: shipment.cargoTicketPrice,
      ticketPrice: shipment.ticketPrice,
      comment: shipment.comment,
      employee_id: shipment.employee?.user_id || '',
      shipment_status_id: shipment.shipmentStatus?.id || '',
      country_id: shipment.country?.id || '',
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingShipment(null);
    setErrors({});
  }

  function field(key) {
    return e => setForm({ ...form, [key]: e.target.value });
  }

  async function handleSave() {
    const newErrors = {};

    if (!editingShipment && allCountries.length === 0) newErrors.country_id = 'No countries available. Please add a country first.';
    if (!form.departureDate) newErrors.departureDate = 'Departure date is required.';
    if (!form.arrivalDate) newErrors.arrivalDate = 'Arrival date is required.';
    else if (form.departureDate && form.arrivalDate < form.departureDate) newErrors.arrivalDate = 'Cannot be before departure date.';
    if (!form.arrivalPlace.trim()) newErrors.arrivalPlace = 'Arrival place is required.';
    if (!form.returningDate) newErrors.returningDate = 'Returning date is required.';
    else if (form.arrivalDate && form.returningDate < form.arrivalDate) newErrors.returningDate = 'Cannot be before arrival date.';
    if (!form.returningPlace.trim()) newErrors.returningPlace = 'Returning place is required.';
    if (form.ticketPrice === '' || Number(form.ticketPrice) < 0) newErrors.ticketPrice = 'Valid ticket price is required.';
    if (form.cargoTicketPrice === '' || Number(form.cargoTicketPrice) < 0) newErrors.cargoTicketPrice = 'Valid cargo ticket price is required.';
    if (!form.country_id && !newErrors.country_id) newErrors.country_id = 'Country is required.';
    if (!form.employee_id) newErrors.employee_id = 'Employee is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 4000);
      return;
    }

    setErrors({});
    const data = {
      ...form,
      cargoTicketPrice: Number(form.cargoTicketPrice),
      ticketPrice: Number(form.ticketPrice),
      employee_id: form.employee_id || null,
      shipment_status_id: form.shipment_status_id || null,
      country_id: form.country_id || null,
    };

    if (editingShipment) {
      const updated = await dispatch(updateShipment(editingShipment.id, data));
      if (updated) {
        if (expandedId === editingShipment.id) dispatch(fetchSubShipments(editingShipment.id));
        closeDialog();
      }
    } else {
      const created = await dispatch(createShipment(data));
      if (created) closeDialog();
    }
  }

  async function handleDelete() {
    const success = await dispatch(deleteShipment(deleteConfirm.id));
    if (success) setDeleteConfirm(null);
  }

  const safePage = Math.min(page, Math.max(0, Math.ceil(shipments.length / PAGE_SIZE) - 1));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Shipments</h3>
        <Button variant="contained" color="primary" onClick={openCreate}>Add</Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Departure</TableCell>
            <TableCell>Arrival Place</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Employee</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>SubShipments</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shipments.length === 0 && (
            <TableRow><TableCell colSpan={8} align="center" style={{ color: '#888', padding: '2rem' }}>No shipments found.</TableCell></TableRow>
          )}
          {shipments.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE).map(s => (
            <React.Fragment key={s.id}>
              <TableRow>
                <TableCell>{s.id}</TableCell>
                <TableCell>{formatDate(s.departureDate)}</TableCell>
                <TableCell>{s.arrivalPlace}</TableCell>
                <TableCell>{s.country?.name || '—'}</TableCell>
                <TableCell>{s.employee?.full_name || '—'}</TableCell>
                <TableCell>{s.shipmentStatus?.status || '—'}</TableCell>
                <TableCell>{s.numOfSubs}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}>
                    {expandedId === s.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                  <IconButton size="small" onClick={() => openEdit(s)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={e => { e.currentTarget.blur(); setDeleteConfirm(s); }}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
              {expandedId === s.id && (
                <TableRow>
                  <TableCell colSpan={8} style={{ padding: 0 }}>
                    <SubShipments shipmentId={s.id} shipmentEmployeeId={s.employee?.user_id} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={shipments.length}
        page={safePage}
        onPageChange={(_, newPage) => { setPage(newPage); setExpandedId(null); }}
        rowsPerPage={PAGE_SIZE}
        rowsPerPageOptions={[]}
      />

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="md">
        <DialogTitle>{editingShipment ? 'Edit Shipment' : 'Create Shipment'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Departure Date" type="date" fullWidth margin="normal" variant="outlined"
                InputLabelProps={{ shrink: true }} value={form.departureDate} onChange={field('departureDate')}
                error={!!errors.departureDate} helperText={errors.departureDate} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Arrival Date" type="date" fullWidth margin="normal" variant="outlined"
                InputLabelProps={{ shrink: true }} value={form.arrivalDate} onChange={field('arrivalDate')}
                error={!!errors.arrivalDate} helperText={errors.arrivalDate} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Arrival Place" fullWidth margin="normal" variant="outlined"
                value={form.arrivalPlace} onChange={field('arrivalPlace')}
                error={!!errors.arrivalPlace} helperText={errors.arrivalPlace} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Returning Date" type="date" fullWidth margin="normal" variant="outlined"
                InputLabelProps={{ shrink: true }} value={form.returningDate} onChange={field('returningDate')}
                error={!!errors.returningDate} helperText={errors.returningDate} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Returning Place" fullWidth margin="normal" variant="outlined"
                value={form.returningPlace} onChange={field('returningPlace')}
                error={!!errors.returningPlace} helperText={errors.returningPlace} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Ticket Price" type="number" fullWidth margin="normal" variant="outlined"
                value={form.ticketPrice} onChange={field('ticketPrice')}
                error={!!errors.ticketPrice} helperText={errors.ticketPrice} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Cargo Ticket Price" type="number" fullWidth margin="normal" variant="outlined"
                value={form.cargoTicketPrice} onChange={field('cargoTicketPrice')}
                error={!!errors.cargoTicketPrice} helperText={errors.cargoTicketPrice} />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.employee_id}>
                <InputLabel>Employee</InputLabel>
                <Select value={form.employee_id} onChange={field('employee_id')} label="Employee">
                  <MenuItem value="">— None —</MenuItem>
                  {employees.map(e => (
                    <MenuItem key={e.userId} value={e.userId}>{e.fullName}</MenuItem>
                  ))}
                </Select>
                {errors.employee_id && <Typography variant="caption" color="error" style={{ marginLeft: 14, marginTop: 4 }}>{errors.employee_id}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.country_id}>
                <InputLabel>Country</InputLabel>
                <Select value={form.country_id} onChange={field('country_id')} label="Country">
                  <MenuItem value="">— None —</MenuItem>
                  {countries.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
                {errors.country_id && <Typography variant="caption" color="error" style={{ marginLeft: 14, marginTop: 4 }}>{errors.country_id}</Typography>}
              </FormControl>
            </Grid>
            {editingShipment && (
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select value={form.shipment_status_id} onChange={field('shipment_status_id')} label="Status">
                    <MenuItem value="">— None —</MenuItem>
                    {statuses.map(s => (
                      <MenuItem key={s.id} value={s.id}>{s.status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField label="Comment" fullWidth margin="normal" variant="outlined" multiline rows={2}
                value={form.comment} onChange={field('comment')} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Shipment</DialogTitle>
        <DialogContent>Are you sure you want to delete this shipment to <strong>{deleteConfirm?.arrivalPlace}</strong>?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Shipments;
