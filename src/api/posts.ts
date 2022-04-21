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
    isPick?: boolean;
}

export interface IPostsItem {
    id: number;
    title: string;
    content: string;
    introduction: string;
    author: IAuthor;
    messageNumber: number;
    goodNumber: number;
    isGood: boolean;
    createTime: string;
    collectNumber: number;
    isCollect: boolean;
    isFollow: boolean;
    isMy: boolean;
}

interface IGetPostsListResponse {
    maxPage: number;
    list: IPostsItem[];
}

interface IGetPostsInfoRequest {
    id?: number;
}

interface IAlterPostsInfoRequest {
    id?: number;
    title: string;
    content: string;
    introduction: string;
}

interface IGoodPostsRequest {
    postID: number;
    isGood: boolean;
}

interface ICollectPostsRequest {
    postID: number;
    isCollect: boolean;
}

// 贴子，收藏，赞，评论
export type IPostListPropsType = 'post' | 'collect' | 'good' | 'message';

interface IGetPostsListByUserIDRequest {
    userID: string;
    type: IPostListPropsType;
}

interface IAddPostRequest {
    title: string;
    content: string;
    introduction: string;
}

// 获取帖子列表接口
export const getPostsListApi = async (data: IGetPostsListRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IGetPostsListResponse>(`${backIP}/api/post/list`, data, 'get', headers)
}

// 获取帖子信息接口
export const getPostsInfoApi = async (data: IGetPostsInfoRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IPostsItem>(`${backIP}/api/post`, data, 'get', headers)
}

// 修改帖子信息接口
export const alterPostsInfoApi = async (data: IAlterPostsInfoRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IPostsItem>(`${backIP}/api/post`, data, 'put', headers)
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

// 根据用户ID获取帖子收藏列表接口
export const getPostsListByUserIDApi = async (data: IGetPostsListByUserIDRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IPostsItem[]>(`${backIP}/api/user/post/list`, data, 'get', headers)
}

// 新增贴子接口
export const addPostApi = async (data: IAddPostRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IPostsItem[]>(`${backIP}/api/post`, data, 'post', headers)
}