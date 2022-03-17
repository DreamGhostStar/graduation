import { backIP } from "consts";
import { setUserTokenHeaders } from "utils";
import Http from "./http";
import { IAuthor } from "./posts";

interface IGetCaseListRequest {
    page?: number;
    word?: string;
}

export interface ICaseItem {
    id: number;
    title: string;
    content: string;
    author: IAuthor;
    isFollow: boolean;
    deadlineTime: string;
    // 接取者
    pickUser: {
        isLook: boolean;
        isPick: boolean;
        list: IAuthor[];
    };
}

interface IGetCaseListResponse {
    list: ICaseItem[];
}

interface IEntrustCaseRequest {
    userID: number;
    isEntrust: boolean;
}

// 获取案件列表接口
export const getCaseListApi = async (data: IGetCaseListRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IGetCaseListResponse>(`${backIP}/api/case/list`, data, 'get', headers)
}

// 发布者委托/取消委托接口
export const entrustCaseApi = async (data: IEntrustCaseRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<string>(`${backIP}/api/case/entrust`, data, 'put', headers)
}