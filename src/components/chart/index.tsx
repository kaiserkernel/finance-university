import { BarChart } from '@mui/x-charts/BarChart';
import { DashboardContent } from "@/layouts/dashboard";

import {
  Box,
  Card,
  Typography,
  TextField,
  MenuItem
} from "@mui/material";

// ----------------------------------------------------------------------

export default function Page() {
  const pData = [24, 13, 98, 38, 48, 38, 43];
  const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
  ];

  const series = [
    {data: pData, label: 'pv', id: 'pvId'},
  ]

  const xAxios = ['college', 'announcemnet'];
  const yAxios = ['fund', 'milestone'];

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Analysis
        </Typography>
        <Typography variant="h5">{ }</Typography>
      </Box>

      <Card
        sx={{
          padding: "30px"
        }}
      >
        <Box display="flex" justifyContent="flex-end" padding="10px">
          <TextField
            select
            label="X-Axios"
            helperText="Please select x-axios data"  
          >
            {xAxios.map((value, idx) => (
              <MenuItem key={idx} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Y-Axios"
            helperText="Please select Y-axios data" 
            sx={{
              marginLeft: "20px"
            }} 
          >
            {yAxios.map((value, idx) => (
              <MenuItem key={idx} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        </Box>        
        <BarChart
          height={500}
          series={series}
          xAxis={[{ data: xLabels, scaleType: 'band', label: 'College' }]}
        />
      </Card>
    </DashboardContent>
  );
}
