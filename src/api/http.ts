import axios, { AxiosRequestHeaders, Method } from "axios";
import cookie from 'react-cookies'

// 创建axios默认请求
// axios.defaults.baseURL = "http://106.14.174.206/api"; // 后端代码
// 配置超时时间
axios.defaults.timeout = 100000;
// 添加响应拦截器
axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export interface BaseHttpResponse<T = any> {
    code: number;
    data: T;
    message: string;
}

class Http {
    static async request<T, U = BaseHttpResponse<T>>(
        url: string,
        data: any,
        method: Method,
        headers: AxiosRequestHeaders = {}
    ): Promise<U> {
        const csrfToken = cookie.load('csrfToken');
        headers = {
            ...headers,
            'x-csrf-token': csrfToken || null
        }
        if (method.toLowerCase() === 'get') {
            return new Promise((resolve, reject) => {
                axios
                    .get(url, {
                        params: data,
                        headers: headers,
                        withCredentials: true
                    })
                    .then(res => {
                        resolve(res.data);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        } else {
            return new Promise((resolve, reject) => {
                axios({
                    method: method,
                    data: data,
                    headers: headers,
                    url: url,
                    withCredentials: true
                }).then(res => {
                    resolve(res.data);
                })
                    .catch(err => {
                        reject(err);
                    });

            });
        }
    }
}

export default Http