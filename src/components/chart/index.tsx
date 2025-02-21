import {useState, useEffect} from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { DashboardContent } from "@/layouts/dashboard";
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from "react-toastify";
import { ChartsAxisData } from '@mui/x-charts';
import {
  Box,
  Card,
  Typography,
  TextField,
  MenuItem,
  Button,
  Tooltip
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { isAxiosError } from 'axios';

import { fetchChartData, fetchChartDataForAnnouncement, fetchChartDataForCollege, formatChartData } from '@/services/chartService';
import { College } from '@/types/chart';
import { getCurrentUser } from '@/services/authService';
import { collegeList } from '@/constants/collegeList';
import { tooltips } from '@/constants/tooltip';

// ----------------------------------------------------------------------

interface SelectedChart {
  name: string,
  value: string
}

export default function Page() {
  const userInfo = getCurrentUser();
  const [axis, setAxis] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(false);
  const [originChartData, setOriginChartData] = useState<College[]>();
  const [chartData, setChartData] = useState<number[]>([]);
  const [xLabels, setXLabels] = useState<string[]>([]);
  const [selectedChart, setSelectedChart] = useState<SelectedChart>({
    name: '',
    value: ''
  })

  const xAxisList = ['college', 'announcement'];

  const updateChartData = (xLabels: string[], chartData: number[], axis: string, originChartData?: College[]) => {
    setXLabels(xLabels);
    setChartData(chartData);
    setAxis(axis);
    if (originChartData) setOriginChartData(originChartData);
  }

  const handleChangeAxis = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = evt.target;
    setLoading(true);

    try {
      const { data } = await fetchChartData(value);
      const {_xLabel, _chartData} = formatChartData(data.data);
      updateChartData(_xLabel, _chartData, value);
      if (_chartData.length) {
        toast.success("Successfully fetch data for chart");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        error.response?.data.msg.map((str: string) => {
          toast.error(str);
        });
      }
      else
        toast.error("Error occured. Please try again");
    } finally {
      setLoading(false);
    }
  }

  const handleClickAxis = async (data: ChartsAxisData | null) => {
    const axisValue = data?.axisValue?.toString();
    setLoading(true);
    
    if (axis === 'college' && axisValue) {
      setSelectedChart({
        name: 'college',
        value: axisValue
      });

      try {
        const { data } = await fetchChartDataForCollege(axisValue);
        const {_xLabel, _chartData} = formatChartData(data.data);
        updateChartData(_xLabel, _chartData, 'user');
        if (_chartData.length) {
          toast.success("Successfully fetch data for chart");
        }
      } catch (error) {
        if (isAxiosError(error)) {
          error.response?.data.msg.map((str: string) => {
            toast.error(str);
          });
        }
        else
          toast.error("Error occured. Please try again");
      } finally {
        setLoading(false);
      }
    } else if (axis === 'announcement' && axisValue) {
      setSelectedChart({
        name: 'announcement',
        value: axisValue
      });

      try {
        const { data } = await fetchChartDataForAnnouncement(axisValue);
        const {_xLabel, _chartData} = formatChartData(data.data);
        updateChartData(_xLabel, _chartData, 'user');
        if (_chartData.length) {
          toast.success("Successfully fetch data for chart");
        }
      } catch (error) {
        if (isAxiosError(error)) {
          error.response?.data.msg.map((str: string) => {
            toast.error(str);
          });
        }
        else
          toast.error("Error occured. Please try again");
      } finally {
        setLoading(false);
      }
    }
    setLoading(false);
  };

  const handleClickBack = async () => {
    if (selectedChart.name === 'college' || selectedChart.name === 'announcement') {
      const { data } = await fetchChartData(selectedChart.name);
      const _data = data.data;
      const {_xLabel, _chartData} = formatChartData(_data);

      updateChartData(_xLabel, _chartData, selectedChart.name, _data);
      setSelectedChart({
        name: '',
        value: ''
      });
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        let _data;
        let axis:string = '';
        
        if (userInfo.role === 'col_dean' && userInfo.college) {
          const college = collegeList.find(col => col.value === userInfo.college)?.name || '';
          axis='user';
          const { data } = await fetchChartDataForCollege(college);
          _data = data.data;

        } else if (['grant_dep', 'grant_dir', 'finance'].includes(userInfo.role)) {
          axis = 'college';
          const { data } = await fetchChartData('college');
          _data = data.data;
        }

        const {_xLabel, _chartData} = formatChartData(_data);
        updateChartData(_xLabel, _chartData, axis, _data);
      } catch (error) {
        if (isAxiosError(error)) {
          error.response?.data.msg.map((str: string) => {
            toast.error(str);
          });
        }
        else
          toast.error("Error occured. Please try again");
      } finally {
        setLoading(false);
      }
    }
    
    fetchInitialData();
  }, [])

  const ActionPart = () => {
    if (['grant_dep', 'grant_dir', 'finance'].includes(userInfo.role)) {
      if (axis === "college" || axis === "announcement") {
        return (
          <Box display="flex" justifyContent="flex-end" padding="10px">
            <TextField
              select
              label="X-Axis"
              helperText="Please select x-axis data"  
              onChange={handleChangeAxis}
              name="xAxis"
              value={axis}
            >
              {xAxisList.map((value, idx) => (
                <MenuItem key={idx} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )
      } else if (axis === "user") {
        return (
          <Box display="flex" justifyContent="space-between">
            <Typography variant='h5'>{selectedChart.value}</Typography>
            <Button variant='outlined' onClick={handleClickBack}>
              <ArrowBackIosIcon/> Back
            </Button>
          </Box>
        )
      }
    }
    return null;
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Analysis {selectedChart.name ? `(${selectedChart.name})` : ''}
        </Typography>
      </Box>

      <Card sx={{ padding: "30px" }}>
        <ActionPart/>
        {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center"}}>
              <CircularProgress size="10rem" color='success'/>
            </Box>
          ) : (
            <BarChart
              height={500}
              series={[{data: chartData, label: "Budget", id: "budget"}]}
              xAxis={[{ 
                  data: xLabels, 
                  scaleType: 'band', 
                  label: axis?.toLocaleUpperCase(),
                  valueFormatter: (value, context) =>
                    context.location === 'tick'
                      ? value
                      : `${axis}: ${axis === 'college' ? originChartData?.find((data:College) => data.title === value)?.content : value}`,
                }]}
              onAxisClick={(_, d) => handleClickAxis(d)}
            />
          )}
      </Card>
    </DashboardContent>
  );
}
