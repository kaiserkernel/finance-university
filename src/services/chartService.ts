import axios from "axios";
import { College } from "@/types/chart";

export const fetchChartData = (data: string) => {
    return axios.post("api/chart/", {axis: data});
}

export const fetchChartDataForCollege = (data: string) => {
    return axios.post("api/chart/college/" + data);
}

export const fetchChartDataForAnnouncement = (data: string) => {
    return axios.post("api/chart/announcement/" + data);
}

export const formatChartData = (data: [College]) => {
    const _xLabel = data.map((log:any) => log.title);
    const _chartData = data.map((log:any) => log.totalBudget);
    return {
        _xLabel,
        _chartData
    }
}