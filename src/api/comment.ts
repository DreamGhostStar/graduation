import { backIP } from "consts";
import { setUserTokenHeaders } from "utils";
import Http from "./http";
import { IAuthor } from "./posts";

export interface IChildrenComment {
    id: number;
    time: string;
    content: string;
    author: IAuthor;
    goodNumber: number;
    isGood: boolean;
    replyAuthor: IAuthor;
}

interface IGetPostCommentListRequest {
    id: number;
}

export interface IGetPostCommentListResponse {
    id: number;
    time: string;
    content: string;
    author: IAuthor;
    goodNumber: number;
    isGood: boolean;
    children: IChildrenComment[];
}

interface IGoodPostCommentRequest {
    id: number;
    isGood: boolean;
}

interface IAddCommentRequest {
    postID: number;
    replyCommentID?: number;
    value: string;
}

// 获取贴子的评论列表接口
export const getPostCommentListApi = async (data: IGetPostCommentListRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IGetPostCommentListResponse[]>(`${backIP}/api/comment`, data, 'get', headers)
}

// 点赞/取消点赞评论接口
export const goodPostCommentApi = async (data: IGoodPostCommentRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<string[]>(`${backIP}/api/comment/good`, data, 'put', headers)
}

// 发送贴子评论接口
export const addCommentApi = async (data: IAddCommentRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IGetPostCommentListResponse | IChildrenComment>(`${backIP}/api/comment`, data, 'post', headers)
}