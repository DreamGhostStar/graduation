import { backIP } from "consts";
import { setUserTokenHeaders } from "utils";
import Http from "./http";

interface ISearchOfficeInfoProps {
    word: string;
}

export interface IOfficeItem {
    value: string;
    id: number;
}

// 搜索获取律师事务所信息接口
export const searchOfficeInfoApi = async (data: ISearchOfficeInfoProps) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IOfficeItem[]>(`${backIP}/api/office/search`, data, 'get', headers)
}