import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { BASE_URL, PAGE_SIZE } from '../../constants/appConstants';
import { fetchUserSubShipments } from '../../actions/subShipmentsActions';
import { fetchMyShipments, fetchShipmentStatuses, updateShipment } from '../../actions/shipmentsActions';
import SubShipments from '../Shipments/SubShipments';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString();
}

function EmployeeView({ userId }) {
  const dispatch = useDispatch();
  const shipments = useSelector(state => state.shipments.data);
  const loading = useSelector(state => state.shipments.loading);
  const shipmentStatuses = useSelector(state => state.shipments.statuses);
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyShipments(userId));
    dispatch(fetchShipmentStatuses());
  }, [userId]);

  async function handleShipmentStatusChange(shipmentId, statusId) {
    await dispatch(updateShipment(shipmentId, { shipment_status_id: statusId }));
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><CircularProgress /></div>;

  if (shipments.length === 0) {
    return <Typography color="textSecondary">No shipments assigned to you.</Typography>;
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Arrival Place</TableCell>
            <TableCell>Departure</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Sub-Shipments</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shipments.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(s => (
            <React.Fragment key={s.id}>
              <TableRow>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.arrivalPlace}</TableCell>
                <TableCell>{formatDate(s.departureDate)}</TableCell>
                <TableCell>
                  <Select
                    value={s.shipmentStatus?.id || ''}
                    onChange={e => handleShipmentStatusChange(s.id, e.target.value)}
                    displayEmpty
                  >
                    {shipmentStatuses.map(st => <MenuItem key={st.id} value={st.id}>{st.status}</MenuItem>)}
                  </Select>
                </TableCell>
                <TableCell>{s.numOfSubs}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}>
                    {expandedId === s.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
              {expandedId === s.id && (
                <TableRow>
                  <TableCell colSpan={6} style={{ padding: 0 }}>
                    <SubShipments
                      key={s.shipmentStatus?.id}
                      shipmentId={s.id}
                      shipmentEmployeeId={s.employee?.user_id}
                      readOnly
                      canChangeStatus
                    />
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
        page={page}
        onPageChange={(_, newPage) => { setPage(newPage); setExpandedId(null); }}
        rowsPerPage={PAGE_SIZE}
        rowsPerPageOptions={[]}
      />
    </>
  );
}

function ClientView({ subShipments }) {
  const [page, setPage] = useState(0);

  if (subShipments === null) return <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><CircularProgress /></div>;

  if (subShipments.length === 0) {
    return <Typography color="textSecondary">No deliveries assigned to you.</Typography>;
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Shipment</TableCell>
            <TableCell>Place</TableCell>
            <TableCell>Item Type</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Delivery Date</TableCell>
            <TableCell>Proof</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subShipments.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(ss => (
            <TableRow key={ss.id}>
              <TableCell>{ss.shipment?.arrivalPlace || '—'}</TableCell>
              <TableCell>{ss.subShipmentPlace}</TableCell>
              <TableCell>{ss.cargoToItemType?.itemType?.name || '—'}</TableCell>
              <TableCell>{ss.cargoToItemType?.cargo?.quantity ?? '—'}</TableCell>
              <TableCell>{ss.subShipmentStatus?.status || '—'}</TableCell>
              <TableCell>{formatDate(ss.deliveryDate)}</TableCell>
              <TableCell>
                {ss.proof ? <a href={ss.proof} target="_blank" rel="noreferrer">View</a> : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={subShipments.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={PAGE_SIZE}
        rowsPerPageOptions={[]}
      />
    </>
  );
}

function MyShipments() {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.userId);
  const userType = useSelector(state => state.auth.userType);
  const clientSubShipments = useSelector(state => state.subShipments.userSubShipments);

  useEffect(() => {
    if (!userId || userType === 1) return;
    dispatch(fetchUserSubShipments(userId));
  }, [userId]);

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>My Shipments</h3>
      {userType === 1 ? (
        <EmployeeView userId={userId} />
      ) : (
        <ClientView subShipments={clientSubShipments} />
      )}
    </div>
  );
}

export default MyShipments;
