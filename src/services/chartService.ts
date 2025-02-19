import axios from "axios";
import { College } from "@/types/chart";

export const fetchChartData = (data: Record<any, String>) => {
    return axios.post("api/chart/", data);
}

export const formatChartData = (data: [College]) => {
    const _xLabel = data.map((log:any) => log.title);
    const _chartData = data.map((log:any) => log.totalBudget);
    return {
        _xLabel,
        _chartData
    }
}