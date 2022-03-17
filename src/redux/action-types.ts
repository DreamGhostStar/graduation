// 包含所有 action type 的常量字符串

import { IOfficeItem } from "api/office";

type IIdentity = 'user' | 'administrator';

// 用户信息接口
export interface IUserConfig {
    avatar?: string;
    nickname?: string;
    username?: string;
    introduction?: string;
    // 职业
    occupation?: string;
    identity?: IIdentity;
    postsNumber?: number;
    caseNumber?: number;
    office?: IOfficeItem;
}

export interface IStoreConfig {
    user: IUserConfig;
}

// 传递登录用户的数据
export const USER_DATA = 'USER_DATA';

// 退出登录，将redux中的数据删去
export const REMOVE_USER_DATA = 'REMOVE_USER_DATA';