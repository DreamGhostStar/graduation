import { Button, Image, message } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { collectPostsApi, goodPostsApi, IPostsItem } from 'api/posts';
import React, { useEffect, useState } from 'react'
import styles from './style.module.scss';
import { MyIcon } from 'utils';
import Comment from '../comment';
import { httpSuccessCode } from 'consts';
import { followUserApi } from 'api/user';

interface IMainProps {
    item?: IPostsItem;
}

export default function Main({ item }: IMainProps) {
    const [isGood, setIsGood] = useState(false)
    const [isFollow, setIsFollow] = useState(item ? item.isFollow : false)
    const [isCollect, setIsCollect] = useState(false)
    const handleClickGood = async () => {
        if (!item) {
            return;
        }
        const requestGoodStatus = isGood;
        setIsGood(!isGood)
        const { code, message: msg } = await goodPostsApi({
            postID: item.id,
            isGood: !requestGoodStatus
        });

        if (code !== httpSuccessCode) {
            message.error(msg);
            setIsGood(!isGood)
        }
    }
    const followUser = async () => {
        if (!item) {
            return;
        }
        const { code, message: msg } = await followUserApi({
            userID: item.author.id,
            isFollow: isFollow
        });

        if (code === httpSuccessCode) {
            message.success(isFollow ? '取消关注成功' : '关注成功');
            setIsFollow(!isFollow);
        } else {
            message.error(msg);
        }
    }
    const collectPost = async () => {
        if (!item) {
            return;
        }
        const { code, message: msg } = await collectPostsApi({
            postID: item.id,
            isCollect: !isCollect
        });

        if (code === httpSuccessCode) {
            message.success(isCollect ? '取消收藏成功' : '收藏成功')
            setIsCollect(!isCollect)
        } else {
            message.error(msg);
        }
    }
    useEffect(() => {
        if (item) {
            setIsGood(item.isGood);
            setIsFollow(item.isFollow);
            setIsCollect(item.isCollect);
        }
    }, [item])

    return (
        <>
            {
                item
                    ? <div className={styles.layout}>
                        <div className={styles.author_layout}>
                            <div className={styles.author_info_layout}>
                                <Image
                                    preview={false}
                                    className={styles.avatar}
                                    width={50}
                                    src={item.author.avatar}
                                />
                                <div className={styles.info_layout}>
                                    <h3 className={styles.author_name}>{item.author.name}</h3>
                                    <p className={styles.introduction}>{item.author.introduction}</p>
                                </div>
                            </div>
                            <Button
                                type={isFollow ? 'default' : "primary"}
                                icon={isFollow ? <CheckOutlined /> : <PlusOutlined />}
                                onClick={followUser}
                            >
                                {isFollow ? '已关注' : '关注他'}
                            </Button>
                        </div>
                        <h1 className={styles.title}>{item.title}</h1>
                        <p className={styles.content}>{item.content}</p>
                        <Comment postID={item.id} />
                        <div className={styles.operation_layout}>
                            <div className={styles.operation_item_layout}>
                                <MyIcon
                                    className={`${styles.operation_icon} ${isGood && styles.operation_active_icon}`}
                                    type="icon-dianzan_kuai"
                                    onClick={handleClickGood}
                                />
                                <p className={styles.number}>{item.goodNumber}</p>
                            </div>
                            <div className={styles.operation_item_layout}>
                                <MyIcon
                                    className={styles.operation_icon}
                                    type="icon-pinglun"
                                />
                                <p className={styles.number}>{item.messageNumber}</p>
                            </div>
                            <div className={styles.operation_item_layout}>
                                <MyIcon
                                    className={`${styles.operation_icon} ${isCollect && styles.operation_active_icon}`}
                                    type="icon-guanzhu-yiguanzhu"
                                    onClick={collectPost}
                                />
                                <p className={styles.number}>{item.collectNumber}</p>
                            </div>
                        </div>
                    </div >
                    : <div></div>
            }
        </>
    )
}
