import React, { useCallback, useEffect, useState } from 'react'
import SideBar from 'components/home/sidebar';
import styles from './style.module.scss';
import { httpSuccessCode, tokenKey } from 'consts';
import { useDispatch } from 'react-redux';
import { USER_DATA } from 'redux/action-types';
import { message } from 'antd';
import { getUserInfoApi } from 'api/user';
import cookie from 'react-cookies';
import { useNavigate, useParams } from 'react-router-dom';
import SecondSidebar from 'components/home/secondSidebar';
import { getPostsListApi, IPostsItem } from 'api/posts';
import Main from 'components/home/main';

export interface IGetListInfo {
    word?: string;
    list: IPostsItem[];
    page?: number;
}

type IParamsType = 'post' | 'case' | 'my';
export interface IHomeParams {
    type: IParamsType;
    [key: string]: IParamsType;
}

export default function Home() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [list, setList] = useState<IPostsItem[]>([])
    const [page, setPage] = useState(1)
    const [isSearch, setIsSearch] = useState(false)
    const params = useParams<IHomeParams>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // 获取贴子列表
    const getListInfo = useCallback(async ({
        word,
        list,
        page
    }: IGetListInfo) => {
        const requestObj = word ? { word } : { page };
        const requestApiMap = {
            post: getPostsListApi,
            case: getPostsListApi,
            my: getPostsListApi,
        }
        const type: IParamsType = params.type || 'post';
        const { code, data, message: msg } = await requestApiMap[type](requestObj);

        if (code === httpSuccessCode) {
            const updateList = word ? data.list : [...list, ...data.list];
            if (word) {
                setIsSearch(true)
            } else {
                setIsSearch(false)
            }
            setList(updateList)
        } else {
            message.error(msg);
        }
    }, [params.type]);
    const getUserInfo = useCallback(async () => {
        const token = cookie.load(tokenKey);
        if (!token) {
            navigate('/login/register');
        }
        const { code, data, message: msg } = await getUserInfoApi();
        if (code === httpSuccessCode) {
            dispatch({ type: USER_DATA, data });
        } else {
            message.error(msg);
        }
    }, [navigate, dispatch])
    useEffect(() => {
        getUserInfo();
    }, [getUserInfo])
    useEffect(() => {
        getListInfo({
            list,
            page
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getListInfo, page])

    return (
        <div className={styles.layout}>
            <SideBar />
            <SecondSidebar
                list={list}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                getListInfo={getListInfo}
                setPage={setPage}
                isSearch={isSearch}
            />
            <Main item={list[activeIndex]} />
        </div>
    )
}