import { Image, message, Tabs } from 'antd';
import { getUserInfoApi } from 'api/user';
import CaseList from 'components/my/caseList';
import FollowUserList from 'components/my/followUserList';
import Header from 'components/my/header';
import PostList from 'components/my/postList';
import { httpSuccessCode } from 'consts';
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { IUserConfig } from 'redux/action-types';
import { MyIcon } from 'utils';
import styles from './style.module.scss';

export interface IMyParams {
    id: string;
    [key: string]: string;
}
const { TabPane } = Tabs;

export default function My() {
    const params = useParams<IMyParams>();
    const [userInfo, setUserInfo] = useState<IUserConfig | null>(null)
    const getUserInfo = useCallback(async () => {
        const { code, data, message: msg } = await getUserInfoApi({
            userID: parseInt(params.id!)
        });

        if (code === httpSuccessCode) {
            setUserInfo(data);
        } else {
            message.error(msg);
        }
    }, [params.id]);
    const callback = (key: string) => {
        console.log(key);
    }
    useEffect(() => {
        if (params.id !== undefined) {
            getUserInfo();
        }
    }, [params.id, getUserInfo])

    return (
        <div className={styles.layout}>
            <div className={styles.mask}></div>
            <Header />
            {
                userInfo
                    ? <div className={styles.main_layout}>
                        <div className={styles.main}>
                            <div className={styles.user_layout}>
                                <Image
                                    preview={false}
                                    src={userInfo.avatar}
                                    className={styles.avatar}
                                    width={90}
                                />
                                <div className={styles.user_info}>
                                    <p className={styles.user_nickname}>{userInfo.nickname}</p>
                                    <div className={styles.introduction}>
                                        <MyIcon type="icon-gerenjianjie" className={styles.introduction_icon} />
                                        <span>{userInfo.introduction}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.detail_layout}>
                                <Tabs
                                    defaultActiveKey="post"
                                    onChange={callback}
                                    className='detail_tab_layout'
                                >
                                    <TabPane tab="贴子" key="post">
                                        <PostList type='post' />
                                    </TabPane>
                                    <TabPane tab="案件" key="case">
                                        <CaseList />
                                    </TabPane>
                                    <TabPane tab="关注" key="follow">
                                        <FollowUserList />
                                    </TabPane>
                                    <TabPane tab="收藏" key="collect">
                                        <PostList type='collect' />
                                    </TabPane>
                                    <TabPane tab="赞" key="good">
                                        <PostList type='good' />
                                    </TabPane>
                                    <TabPane tab="评论" key="comment">
                                        <PostList type='message' />
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                        <div>
                            <div className={styles.sidebar}>
                                <div className={styles.follow_layout}>
                                    <div className={styles.follow}>
                                        <p className={styles.follow_text}>关注了</p>
                                        <p className={styles.follow_text}>{userInfo.followNumber}</p>
                                    </div>
                                    <div className={styles.follow}>
                                        <p className={styles.follow_text}>关注者</p>
                                        <p className={styles.follow_text}>{userInfo.followedNumber}</p>
                                    </div>
                                </div>
                                <div className={styles.sidebar_item_layout}>
                                    <div className={styles.sidebar_item}>
                                        <p className={styles.sidebar_item_text}>收藏</p>
                                        <p className={styles.sidebar_item_text}>{userInfo.collectNumber}</p>
                                    </div>
                                    <div className={styles.sidebar_item}>
                                        <p className={styles.sidebar_item_text}>加入于</p>
                                        <p className={styles.sidebar_item_text}>{userInfo.joinTime}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : <div></div>
            }
        </div>
    )
}
