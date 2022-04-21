import { backIP } from "consts";
import { IUserConfig } from "redux/action-types";
import { setUserTokenHeaders } from "utils";
import Http from "./http";

interface ISearchOfficeInfoProps {
    word: string;
}

export type IOfficeIdentity = 'ordinary' | 'Administration';

export interface IOfficeItem {
    value: string;
    id: number;
    identity: IOfficeIdentity;
}

interface IApplyGetIntoOfficeRequest {
    id: number;
}

interface IGetOfficePersonInfoRequest {
    // 事务所ID
    id: number;
}

interface IRemovePersonRequest {
    userID: number;
}

interface IGetOfficeJoinInfoRequest {
    officeID: number;
}

export type IJoinOfficeStatus = 'pending' | 'agree' | 'refuse';

export interface IGetOfficeJoinInfoResponse {
    user: IUserConfig;
    // 消息ID
    id: number;
    status: IJoinOfficeStatus;
}

interface ISendJoinStatusRequest {
    // 消息ID
    id: number;
    status: IJoinOfficeStatus;
}

// 搜索获取律师事务所信息接口
export const searchOfficeInfoApi = async (data: ISearchOfficeInfoProps) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IOfficeItem[]>(`${backIP}/api/office/search`, data, 'get', headers)
}

// 申请进入律师事务所接口
export const applyGetIntoOfficeApi = async (data: IApplyGetIntoOfficeRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<string>(`${backIP}/api/office/apply`, data, 'put', headers)
}

// 获取律师事务所所有人员信息
export const getOfficePersonInfoApi = async (data: IGetOfficePersonInfoRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IUserConfig[]>(`${backIP}/api/office`, data, 'get', headers)
}

// 移除用户
export const removeOfficePersonApi = async (data: IRemovePersonRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<string>(`${backIP}/api/office`, data, 'delete', headers)
}

// 获取事务所用户加入信息
export const getOfficeJoinInfoApi = async (data: IGetOfficeJoinInfoRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IGetOfficeJoinInfoResponse[]>(`${backIP}/api/office/message/join`, data, 'get', headers)
}

// 同意/拒绝加入事务所
export const sendJoinStatusApi = async (data: ISendJoinStatusRequest) => {
    const headers = setUserTokenHeaders();
    return await Http.request<IUserConfig>(`${backIP}/api/office/join`, data, 'put', headers)
}