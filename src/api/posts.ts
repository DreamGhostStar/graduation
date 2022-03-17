import { backIP } from "consts";
import { setUserTokenHeaders } from "utils";
import Http from "./http";

export interface IGetPostsListRequest {
    page?: number;
    word?: string;
}

export interface IAuthor {
    id: number;
    name: string;
    avatar: string;
    introduction: string;
}

export interface IPostsItem {
    id: number;
    title: string;
    content: string;
    author: IAuthor;
    messageNumber: number;
    goodNumber: number;
    isGood: boolean;
    createTime: string;
    collectNumber: number;
    isCollect: boolean;
    isFollow: boolean;
}

interface IGetPostsListResponse {
    maxPage: number;
    list: IPostsItem[];
}

interface IGoodPostsRequest {
    postID: number;
    isGood: boolean;
}

interface ICollectPostsRequest {
    postID: number;
    isCollect: boolean;
}

// 修改用户教务信息接口
export const getPostsListApi = async (data: IGetPostsListRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IGetPostsListResponse>(`${backIP}/api/post/list`, data, 'get', headers)
}

// 点赞/取消点赞贴子接口
export const goodPostsApi = async (data: IGoodPostsRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<string>(`${backIP}/api/post/good`, data, 'put', headers)
}

// 收藏/取消收藏贴子接口
export const collectPostsApi = async (data: ICollectPostsRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<string>(`${backIP}/api/post/collect`, data, 'put', headers)
}