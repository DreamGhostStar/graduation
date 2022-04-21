import { PresetStatusColorType } from "antd/lib/_util/colors";
import { backIP } from "consts";
import { setUserTokenHeaders } from "utils";
import Http from "./http";

interface IGetScheduleListRequest {
    year: number;
    month: number;
}

export interface IScheduleItem {
    id: number;
    key: number;
    type: PresetStatusColorType;
    content: string;
    record_time: string;
}

export interface IGetScheduleListResponse {
    [key: string]: IScheduleItem[];
}

interface IAlterScheduleRequest {
    id: number;
    content: string;
}

interface IRemoveScheduleRequest {
    id: number;
}

interface IAddScheduleRequest {
    recordTime: string;
    content: string;
    type: string;
}

// 获取当前月份日程列表
export const getScheduleListApi = async (data: IGetScheduleListRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IGetScheduleListResponse>(`${backIP}/api/schedule`, data, 'get', headers)
}

// 修改日程
export const alterScheduleApi = async (data: IAlterScheduleRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<string>(`${backIP}/api/schedule`, data, 'put', headers)
}

// 删除日程
export const removeScheduleApi = async (data: IRemoveScheduleRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<string>(`${backIP}/api/schedule`, data, 'delete', headers)
}

// 新增日程
export const addScheduleApi = async (data: IAddScheduleRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IScheduleItem>(`${backIP}/api/schedule`, data, 'post', headers)
}