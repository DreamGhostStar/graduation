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
    // 接取者
    pickUserList: {
        isLook: boolean;
        list: IAuthor[];
    };
}

interface IGetCaseListResponse {
    list: ICaseItem[];
}

// 发送贴子评论接口
export const getCaseListApi = async (data: IGetCaseListRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IGetCaseListResponse>(`${backIP}/api/case/list`, data, 'get', headers)
}