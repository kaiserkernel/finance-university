import {useState, useEffect} from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { DashboardContent } from "@/layouts/dashboard";
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

import { fetchChartData, formatChartData } from '@/services/chartService';

import { collegeList } from '@/constants/collegeList';

import {
  Box,
  Card,
  Typography,
  TextField,
  MenuItem
} from "@mui/material";

// ----------------------------------------------------------------------

interface AxiosProps {
  xAxios: string,
  yAxios: string
}

export default function Page() {
  const [axios, setAxios] = useState<AxiosProps>({
    xAxios: 'college',
    yAxios: 'budget'
  });
  const [loading, setLoading] = useState<Boolean>(false);
  const [chartData, setChartData] = useState<number[]>([]);
  
  const xLabels = collegeList.map(log => log.name);

  const xAxiosList = ['college', 'announcemnet'];
  const yAxiosList = ['budget', 'milestone'];

  const handleChangeAxios = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = evt.target;

    setLoading(true);

    try {
      const _chatData = await fetchChartData({
        ...axios,
        [name]: value
      });
      
      setAxios(prev => ({
        ...prev,
        [name]: value
      }));

      toast.success("Successfully fetch data for chart");
    } catch (error) {
      console.log(error, 'error');
    }
    setLoading(false);
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const { data } = await fetchChartData({...axios});
        const _formatData = formatChartData(data.data);
        setChartData(_formatData);
      } catch (error) {
        
      }
      setLoading(false);
    }
    
    fetchInitialData();
  }, [])

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
        {
          loading ? (
            <Box sx={{ display: "flex", justifyContent: "center"}}>
              <CircularProgress 
                size="10rem"
                color='success'
              />
            </Box>
          ) : (
            <BarChart
              height={500}
              series={[{data: chartData, label: axios.yAxios, id: axios.yAxios}]}
              xAxis={[
                { 
                  data: xLabels, 
                  scaleType: 'band', 
                  label: 'College',
                  dataKey: 'code',
                  valueFormatter: (code, context) =>
                  context.location === 'tick'
                    ? code
                    : `College: ${collegeList.find((college) => college.name === code)?.value}`,
                }
              ]}
            />
          )
        }
      </Card>
    </DashboardContent>
  );
}
