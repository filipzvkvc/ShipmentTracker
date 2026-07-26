import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { fetchShipmentsByMonth, fetchItemTypesStatistics } from '../../actions/statisticsActions';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function getCurrentYearMonth() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function sixMonthsAgo() {
  const now = new Date();
  now.setMonth(now.getMonth() - 5);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function Home() {
  const dispatch = useDispatch();
  const [dateFrom, setDateFrom] = useState(sixMonthsAgo());
  const [dateTo, setDateTo] = useState(getCurrentYearMonth());
  const [shipmentData, setShipmentData] = useState([]);
  const [itemTypeData, setItemTypeData] = useState([]);

  useEffect(() => {
    loadShipments();
    loadItemTypes();
  }, []);

  async function loadShipments() {
    const data = await dispatch(fetchShipmentsByMonth(dateFrom, dateTo));
    if (data) setShipmentData(data);
  }

  async function loadItemTypes() {
    const data = await dispatch(fetchItemTypesStatistics());
    if (data) setItemTypeData(data);
  }

  const shipmentsChartData = {
    labels: shipmentData.map(d => `${MONTH_NAMES[d.month]} ${d.year}`),
    datasets: [
      {
        label: 'Shipments',
        data: shipmentData.map(d => Number(d.total_flights) || 0),
        backgroundColor: '#3f51b5',
        yAxisID: 'y',
      },
      {
        label: 'Ticket Revenue',
        data: shipmentData.map(d => Number(d.total_amount) || 0),
        backgroundColor: '#4caf50',
        yAxisID: 'y1',
      },
      {
        label: 'Cargo Revenue',
        data: shipmentData.map(d => Number(d.total_carGoamount) || 0),
        backgroundColor: '#ff9800',
        yAxisID: 'y1',
      },
    ],
  };

  const shipmentsChartOptions = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: { type: 'linear', position: 'left', title: { display: true, text: 'Shipments' } },
      y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Revenue' } },
    },
    plugins: { legend: { position: 'top' } },
  };

  const itemTypesChartData = {
    labels: itemTypeData.map(d => d.itemType?.name || 'Unknown'),
    datasets: [
      {
        label: 'Units Sold',
        data: itemTypeData.map(d => Number(d.total_solded) || 0),
        backgroundColor: '#3f51b5',
      },
    ],
  };

  const itemTypesChartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { title: { display: true, text: 'Units Sold' } } },
  };

  return (
    <div style={{ padding: '0 8px' }}>
      <h3>Dashboard</h3>

      <Paper style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <Typography variant="h6" gutterBottom>Shipments by Month</Typography>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <TextField
            label="From"
            type="month"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            size="small"
          />
          <TextField
            label="To"
            type="month"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            size="small"
          />
          <Button variant="contained" color="primary" onClick={loadShipments}>Apply</Button>
        </div>
        <Bar data={shipmentsChartData} options={shipmentsChartOptions} />
      </Paper>

      <Paper style={{ padding: '1.5rem' }}>
        <Typography variant="h6" gutterBottom>Cargo Sold by Item Type</Typography>
        <Bar data={itemTypesChartData} options={itemTypesChartOptions} />
      </Paper>
    </div>
  );
}

export default Home;
