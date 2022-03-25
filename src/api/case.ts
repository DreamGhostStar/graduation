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
    isMy: boolean;
}

interface IGetCaseListResponse {
    list: ICaseItem[];
}

interface IGetCaseRequest {
    id?: number;
}

interface IAlterCaseRequest {
    id?: number;
    title: string;
    content: string;
    introduction: string;
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

// 获取案件信息接口
export const getCaseInfoApi = async (data: IGetCaseRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<ICaseItem>(`${backIP}/api/case`, data, 'get', headers)
}

// 修改案件信息接口
export const alterCaseInfoApi = async (data: IAlterCaseRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<ICaseItem>(`${backIP}/api/case`, data, 'put', headers)
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