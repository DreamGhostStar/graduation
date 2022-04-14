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
import { getPostsInfoApi, getPostsListApi, IPostsItem } from 'api/posts';
import Main from 'components/home/main';
import { getCaseInfoApi, getCaseListApi, ICaseItem } from 'api/case';
import { MyEditor } from 'components/home/myEditor';
import Schedule from 'components/home/schedule';

export interface IGetListInfo {
    word?: string;
    list: (IPostsItem | ICaseItem)[];
    page?: number;
    id?: number;
    tag: ITag;
    isForceUpdate?: boolean;
}

type IParamsType = 'post' | 'case' | 'schedule' | 'edit';
export interface IHomeParams {
    id: string;
    type: IParamsType;
    [key: string]: IParamsType | string;
}

export type ITag = 'all' | 'office';

export default function Home() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [searchInputValue, setSearchInputValue] = useState('')
    const [list, setList] = useState<(IPostsItem | ICaseItem)[]>([])
    const [page, setPage] = useState(1)
    const [isSearch, setIsSearch] = useState(false)
    const params = useParams<IHomeParams>();
    const [tag, setTag] = useState<ITag>('all')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // 获取贴子列表
    const getListInfo = useCallback(async ({
        word,
        list,
        page,
        id,
        tag,
        isForceUpdate
    }: IGetListInfo) => {
        let requestObj = {};
        let requestApi;
        const requestApiMap = {
            post: getPostsListApi,
            case: getCaseListApi,
            edit: getPostsListApi
        };
        const requestApiWithIDMap = {
            post: getPostsInfoApi,
            case: getCaseInfoApi,
            edit: getPostsInfoApi,
        }
        const type: IParamsType = params.type || 'post';
        if (type === 'schedule') {
            return;
        }
        // 通过id判断请求体和请求API
        if (id !== undefined) {
            requestObj = {
                id
            }
            requestApi = requestApiWithIDMap[type];
        } else {
            requestObj = word ? { word } : { page };
            requestApi = requestApiMap[type];
        }
        if (type === 'edit') {
            return;
        }
        const { code, data, message: msg } = await requestApi({
            ...requestObj,
            tag
        });

        if (code === httpSuccessCode) {
            let updateList = [];
            console.log(isCaseItem(data));
            if (isPostItem(data) || isCaseItem(data)) {
                updateList = [data];
            } else {
                updateList = word || isForceUpdate ? data.list : [...list, ...data.list];
            }
            if (word) {
                setIsSearch(true)
            } else {
                setIsSearch(false)
            }
            setList(updateList as (ICaseItem | IPostsItem)[])
        } else {
            message.error(msg);
        }
    }, [params.type]);
    const getUserInfo = useCallback(async () => {
        const token = cookie.load(tokenKey);
        if (!token) {
            navigate('/login/register');
        }
        const { code, data, message: msg } = await getUserInfoApi({});
        if (code === httpSuccessCode) {
            dispatch({ type: USER_DATA, data });
        } else {
            message.error(msg);
        }
    }, [navigate, dispatch])
    // 判断是否是贴子item
    const isPostItem = (props: any): props is IPostsItem => {
        return (props as IPostsItem).isGood !== undefined;
    }
    // 判断是否是案件item
    const isCaseItem = (props: any): props is ICaseItem => {
        return (props as ICaseItem).pickUser !== undefined;
    }
    const clear = () => {
        setList([]);
        setPage(1);
        setSearchInputValue('')
        setIsSearch(false)
    }
    // 构建右侧页面
    const buildMainProject = () => {
        if (params.type === 'case' || params.type === 'post') {
            return <>
                <SecondSidebar
                    list={list}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    getListInfo={getListInfo}
                    setPage={setPage}
                    isSearch={isSearch}
                    isPostItem={isPostItem}
                    searchInputValue={searchInputValue}
                    setSearchInputValue={setSearchInputValue}
                    type={params.type}
                    tag={tag}
                    setTag={setTag}
                />
                <Main
                    item={list[activeIndex]}
                    isPostItem={isPostItem}
                    isCaseItem={isCaseItem}
                    activeIndex={activeIndex}
                    setList={setList}
                    list={list}
                />
            </>
        } else if (params.type === 'edit') {
            return <MyEditor />
        } else {
            return <Schedule />
        }
    }
    useEffect(() => {
        getUserInfo();
    }, [getUserInfo])
    useEffect(() => {
        getListInfo({
            list,
            page,
            id: params.id !== undefined ? parseInt(params.id) : undefined,
            tag
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, params.type])

    return (
        <div className={styles.layout}>
            <SideBar clear={clear} />
            {buildMainProject()}
        </div>
    )
}
