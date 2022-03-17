// 包含n个reducer函数的模块
import {
    USER_DATA,
    REMOVE_USER_DATA,
    IUserConfig
} from './action-types';

export function transformData(
    state: { user: IUserConfig | null } = { user: null },
    action: {
        data: any
        type: string
    }
) {
    let temp = state;
    switch (action.type) {
        case USER_DATA:
            temp.user = action.data;
            return Object.assign({
                ...temp
            });
        case REMOVE_USER_DATA:
            temp.user = null;
            return temp;
        default:
            return state;
    }
}