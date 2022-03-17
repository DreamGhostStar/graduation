// 后端路径
export const backIP = 'http://127.0.0.1:4523/mock/652159'

// 请求成功状态码
export const httpSuccessCode = 0;

// 用户token键值
export const tokenKey = 'Authorization';

// 登陆注册页面
// 登陆text
export const registerText = '登陆';

// 注册text
export const enrollText = '立即注册';

// 登陆页面跳转至忘记密码页面
export const forgetPasswordText = '忘记密码';

// 使用已有账号进行登录
export const useExistingAccountText = '已有账号登陆';
// 重置密码
export const resetPasswordText = '重置密码'

// 用户名校验reg和错误信息
export const emptyErrorText = '输入不能为空';

export const usernameReg = /\w{6,}/;
export const usernameErrorText = '用户名需要由至少6位以上的字母或数字组成';

export const passwordReg = /\w{6,}/;
export const passwordErrorText = '密码需要由至少6位以上的字母或数字组成';

export const verifyPasswordErrorText = '两次输入密码不一致';

// home页面
// 侧边栏数组
export interface ISideBarItem {
    name: string;
    icon: string;
    type: string;
}

export const sideBarArr: ISideBarItem[] = [
    {
        name: '帖子列表',
        icon: 'icon-liebiao',
        type: 'post'
    },
    {
        name: '案件列表',
        icon: 'icon-wode1',
        type: 'case'
    },
    {
        name: '我的',
        icon: 'icon-wode1',
        type: 'my'
    }
];

export const projectName = '律政云';

// 设置modal中的侧边栏
export const settingSideBarArr = [
    {
        name: '基本设置',
        sign: 'account'
    },
    {
        name: '律师信息设置',
        sign: 'school'
    },
    {
        name: '修改密码',
        sign: 'alter-password'
    }
]

export interface IBaseSettingItem {
    isMandatory: boolean;
    reg?: RegExp;
    name: string;
    placeholder: string;
    sign: string;
    errorText?: string;
}

// modal基本设置基础属性数组
export const baseSettingArr: IBaseSettingItem[] = [
    {
        // 是否必选
        isMandatory: true,
        reg: usernameReg,
        errorText: usernameErrorText,
        name: '用户名',
        placeholder: '请输入用户名',
        sign: 'username'
    },
    {
        // 是否必选
        isMandatory: true,
        name: '昵称',
        placeholder: '请输入昵称',
        sign: 'nickname'
    },
    {
        // 是否必选
        isMandatory: false,
        name: '个人简介',
        placeholder: '个人简介',
        sign: 'introduction'
    }
]
