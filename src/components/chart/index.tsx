import {useState} from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { DashboardContent } from "@/layouts/dashboard";
import CircularProgress from '@mui/material/CircularProgress';

import {
  Box,
  Card,
  Typography,
  TextField,
  MenuItem
} from "@mui/material";

// ----------------------------------------------------------------------

interface AxiosProps {
  xAxios: String,
  yAxios: String
}

export default function Page() {
  const [axios, setAxios] = useState<AxiosProps>({
    xAxios: 'college',
    yAxios: 'budget'
  })
  
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

  const xAxiosList = ['college', 'announcemnet'];
  const yAxiosList = ['budget', 'milestone'];

  const handleChangeAxios = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = evt.target;
    setAxios(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Analysis
        </Typography>
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
            onChange={handleChangeAxios}
            name="xAxios"
            value={axios.xAxios}
          >
            {xAxiosList.map((value, idx) => (
              <MenuItem key={idx} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Y-Axios"
            helperText="Please select Y-axios data" 
            onChange={handleChangeAxios}
            name="yAxios"
            value={axios.yAxios}
            sx={{
              marginLeft: "20px"
            }} 
          >
            {yAxiosList.map((value, idx) => (
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
