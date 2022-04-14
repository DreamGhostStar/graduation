import { Button, Divider, Input } from 'antd';
import { projectName } from 'consts';
import React, { ChangeEvent, useRef } from 'react'
import styles from './style.module.scss';
import { MyIcon } from 'utils';
import { IPostsItem } from 'api/posts';
import { IGetListInfo, ITag } from 'pages/home';
import { ICaseItem } from 'api/case';
import { useSelector } from 'react-redux';
import { IStoreConfig } from 'redux/action-types';

interface ISecondSidebarProps {
    list: (IPostsItem | ICaseItem)[];
    activeIndex: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
    getListInfo: ({ word, list }: IGetListInfo) => Promise<void>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    isSearch: boolean;
    isPostItem: (props: IPostsItem | ICaseItem) => props is IPostsItem;
    setSearchInputValue: React.Dispatch<React.SetStateAction<string>>;
    searchInputValue: string;
    type: "post" | "case";
    tag: ITag;
    setTag: React.Dispatch<React.SetStateAction<ITag>>;
}

export default function SecondSidebar({
    list,
    activeIndex,
    setActiveIndex,
    getListInfo,
    setPage,
    isSearch,
    isPostItem,
    setSearchInputValue,
    searchInputValue,
    type,
    tag,
    setTag
}: ISecondSidebarProps) {
    const user = useSelector((state: IStoreConfig) => state.user);
    const scrollRef = useRef<HTMLDivElement>(null)
    const handleSearchInputPress = () => {
        getListInfo({
            word: searchInputValue,
            list,
            tag
        })
    }
    // 监听点击切换tag事件
    const handleClickTag = () => {
        setTag(tag === 'all' ? 'office' : 'all')
        setPage(1)
        getListInfo({
            word: '',
            list,
            tag,
            isForceUpdate: true
        })
    }
    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setSearchInputValue(value)
    }
    // 滚动加载
    const loadMore = () => {
        if (!scrollRef.current) {
            return;
        }
        const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight && !isSearch) {
            setPage(page => page + 1)
        }
    }
    return (
        <div className={styles.layout}>
            <div className={styles.title_layout}>
                <h3 className={styles.title}>{projectName}</h3>
                {
                    type === 'case'
                    && user?.office
                    && <div
                        className={styles.switch_layout}
                        onClick={handleClickTag}
                    >
                        <MyIcon className={styles.switch_icon} type='icon-qiehuan1' />
                        <p>切换至{tag === 'all' ? '律师事务所' : '所有'}</p>
                    </div>
                }
            </div>
            <div className={styles.search_layout}>
                <Input
                    allowClear
                    className={styles.input}
                    value={searchInputValue}
                    onChange={handleSearchInputChange}
                    onPressEnter={handleSearchInputPress}
                />
                <Button
                    type="primary"
                    icon={<MyIcon type="icon-sousuo" />}
                    onClick={handleSearchInputPress}
                />
            </div>

            <div
                className={styles.scroll_layout}
                onScrollCapture={loadMore}
                ref={scrollRef}
            >
                {
                    list.map((listItem, index) => {
                        return <div
                            key={index}
                            className={`${styles.list_item_layout} ${activeIndex === index && styles.list_item_active_layout}`}
                            onClick={() => setActiveIndex(index)}
                        >
                            <p className={styles.item_title}>{listItem.title}</p>
                            <p className={styles.item_introduction}>{listItem.introduction}</p>
                            {
                                isPostItem(listItem) && <div className={styles.icon_layout}>
                                    <div className={styles.icon_item_layout}>
                                        <MyIcon
                                            className={styles.list_item_icon}
                                            type="icon-dianzan_kuai"
                                        />
                                        <p className={styles.number}>{listItem.goodNumber}</p>
                                    </div>
                                    <div className={styles.icon_item_layout}>
                                        <MyIcon
                                            className={styles.list_item_icon}
                                            type="icon-pinglun"
                                        />
                                        <p className={styles.number}>{listItem.messageNumber}</p>
                                    </div>
                                    <div className={styles.icon_item_layout}>
                                        <MyIcon
                                            className={styles.list_item_icon}
                                            type="icon-guanzhu-yiguanzhu"
                                        />
                                        <p className={styles.number}>{listItem.collectNumber}</p>
                                    </div>
                                </div>
                            }
                            {index !== list.length - 1 && <Divider className={styles.divider} />}
                        </div>
                    })
                }
            </div>
        </div>
    )
}
