import axios from "axios";
// import { getCurrentUser } from "./authService";
import { collegeList } from "@/constants/collegeList";

interface College {
    _id: string; // Adjust type based on your actual data
    totalBudget: number;
}

export const fetchChartData = (data: Record<any, String>) => {
    return axios.post("api/chart/", data);
}

export const formatChartData = (data: Record<string, College>) => {
    // Convert data into a map for faster lookups
    const dataMap = new Map<string, number>();
    Object.values(data).forEach((college) => {
        console.log(college, 'college')
        dataMap.set(college._id, college.totalBudget);
    });
    
    // Map over the collegeList and fetch totalBudget from dataMap
    return collegeList.map(log => dataMap.get(log.value) || 0);
}