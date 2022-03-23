import { backIP } from "consts";
import { setUserTokenHeaders } from "utils";
import Http from "./http";
import { IAuthor } from "./posts";

interface IGetCaseListRequest {
    page?: number;
    word?: string;
    userID?: number;
}

export interface ICaseItem {
    id: number;
    title: string;
    content: string;
    introduction: string;
    author: IAuthor;
    isFollow: boolean;
    deadlineTime: string;
    createTime: string;
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

interface IAddCaseRequest {
    title: string;
    content: string;
    introduction: string;
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

// 新增案件接口
export const addCaseApi = async (data: IAddCaseRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<string>(`${backIP}/api/case`, data, 'post', headers)
}