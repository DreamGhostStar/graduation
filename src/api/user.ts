import { backIP } from "consts"
import { IUserConfig } from "redux/action-types"
import { setUserTokenHeaders } from "utils"
import Http from "./http"
import { IOfficeIdentity } from "./office";

interface IRegisterRequest {
    username: string;
    password: string;
}

interface IEnrollRequest {
    username: string;
    password: string;
    verification: string;
}

interface IResetPasswordWithoutNoLoginRequest {
    username: string;
    afterPassword: string;
}

interface IAlterBaseUserInfoRequest {
    username: string;
    nickname: string;
    avatar: string;
    introduction: string;
}

interface IResetPasswordWithLoginRequest {
    beforePassword: string;
    afterPassword: string;
}

interface IAlterUserLawyerInfoRequest {
    officeID?: number;
    occupation?: string | null;
    userID?: number;
}

interface IFollowUserRequest {
    userID: number;
    isFollow: boolean;
}

interface IGetUserInfoRequest {
    userID?: string;
}

interface IGetFollowUserByUserIDRequest {
    userID: string;
}

export interface IFollowUserItem {
    id: number;
    nickname: string;
    isFollow: boolean;
    avatar: string;
}

interface IAlterUserIdentityRequest {
    userID: number;
    identity: IOfficeIdentity;
}

interface IUploadImageResponse {
    url: string
}

interface IUploadImageBaseResponse <T = any> {
    errNo: number;
    data: T;
    message: string;
}

// 用户登陆接口
export const registerApi = async (data: IRegisterRequest) => {
    return await Http.request<string>(`${backIP}/api/user/enroll`, data, 'put')
}

// 用户注册接口
export const enrollApi = async (data: IEnrollRequest) => {
    return await Http.request<string>(`${backIP}/api/user/enroll`, data, 'post')
}

// 未登陆情况下重置密码接口
export const resetPasswordWithNoLoginApi = async (data: IResetPasswordWithoutNoLoginRequest) => {
    return await Http.request<string>(`${backIP}/api/user/password`, data, 'put')
}

// 获取用户信息接口
export const getUserInfoApi = async (data: IGetUserInfoRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IUserConfig>(`${backIP}/api/user`, data, 'get', headers)
}

// 修改用户基本信息接口
export const alterBaseUserInfoApi = async (data: IAlterBaseUserInfoRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IUserConfig>(`${backIP}/api/user/base`, data, 'put', headers)
}

// 登陆情况下重置密码接口
export const resetPasswordWithLoginApi = async (data: IResetPasswordWithLoginRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<string>(`${backIP}/api/user/password`, data, 'put', headers)
}

// 修改用户律师信息接口
export const alterUserLawyerInfoApi = async (data: IAlterUserLawyerInfoRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IUserConfig>(`${backIP}/api/user/lawyer`, data, 'put', headers)
}

// 关注/取消关注用户接口
export const followUserApi = async (data: IFollowUserRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<string>(`${backIP}/api/user/follow`, data, 'put', headers)
}

// 根据用户ID获取用户关注列表
export const getFollowUserByUserIDApi = async (data: IGetFollowUserByUserIDRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IFollowUserItem[]>(`${backIP}/api/user/follow/list`, data, 'get', headers)
}

// 修改用户身份信息接口
export const alterUserIdentityApi = async (data: IAlterUserIdentityRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IUserConfig>(`${backIP}/api/user/identity`, data, 'put', headers)
}

// 获取图片验证码
export const getVerifyImageApi = async () => {
    return await Http.request<string>(`${backIP}/api/user/verify`, {}, 'get')
}

// 获取图片验证码
export const uploadImageApi = async (file: File) => {
    const formData = new FormData();
    formData.append(file.name, file);
    return await Http.request<IUploadImageResponse, IUploadImageBaseResponse>(`${backIP}/api/image`, formData, 'post', {
        'Content-Type': 'multipart/form-data',
    })
}