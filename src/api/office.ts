import { backIP } from "consts";
import { setUserTokenHeaders } from "utils";
import Http from "./http";

interface ISearchOfficeInfoProps {
    word: string;
}

export interface IOfficeItem {
    value: string;
    id: number;
    identity: 'ordinary' | 'Administration';
}

interface IApplyGetIntoOfficeRequest {
    id: number;
}

// 搜索获取律师事务所信息接口
export const searchOfficeInfoApi = async (data: ISearchOfficeInfoProps) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IOfficeItem[]>(`${backIP}/api/office/search`, data, 'get', headers)
}

// 申请进入律师事务所接口
export const applyGetIntoOfficeApi = async (data: IApplyGetIntoOfficeRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<string>(`${backIP}/api/office/apply`, data, 'post', headers)
}