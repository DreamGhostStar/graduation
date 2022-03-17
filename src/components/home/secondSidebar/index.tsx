import { Button, Divider, Input } from 'antd';
import { projectName } from 'consts';
import React, { ChangeEvent, useRef, useState } from 'react'
import styles from './style.module.scss';
import { MyIcon } from 'utils';
import { IPostsItem } from 'api/posts';
import { IGetListInfo } from 'pages/home';

interface ISecondSidebarProps {
    list: IPostsItem[];
    activeIndex: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
    getListInfo: ({ word, list }: IGetListInfo) => Promise<void>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    isSearch: boolean;
}

export default function SecondSidebar({
    list,
    activeIndex,
    setActiveIndex,
    getListInfo,
    setPage,
    isSearch
}: ISecondSidebarProps) {
    const [searchInputValue, setSearchInputValue] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)
    const handleSearchInputPress = () => {
        getListInfo({
            word: searchInputValue,
            list
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
            <h3 className={styles.title}>{projectName}</h3>
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
                            <p className={styles.item_content}>{listItem.content}</p>
                            <div className={styles.icon_layout}>
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
                            {index !== list.length - 1 && <Divider className={styles.divider} />}
                        </div>
                    })
                }
            </div>
        </div>
    )
}