import axios from "axios";
import { getCurrentUser } from "./authService";

export const fetchChartData = (data: Record<any, String>) => {
    const user = getCurrentUser();
    return axios.post("api/chart-data/", {...data, user});
}