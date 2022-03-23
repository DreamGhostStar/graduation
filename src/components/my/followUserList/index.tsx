import { Button, Image, message } from 'antd';
import { followUserApi, getFollowUserByUserIDApi, IFollowUserItem } from 'api/user';
import { httpSuccessCode } from 'consts';
import { IMyParams } from 'pages/my';
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import styles from './style.module.scss';

export default function FollowUserList() {
    const params = useParams<IMyParams>();
    const [list, setList] = useState<IFollowUserItem[]>([]);
    const getPostList = useCallback(async () => {
        const { code, data, message: msg } = await getFollowUserByUserIDApi({
            userID: parseInt(params.id!)
        });

        if (code === httpSuccessCode) {
            setList(data);
        } else {
            message.error(msg);
        }
    }, [params.id])
    const handleClickFollowButton = async (item: IFollowUserItem, index: number) => {
        const { code, message: msg } = await followUserApi({
            userID: item.id,
            isFollow: !item.isFollow
        })

        if (code === httpSuccessCode) {
            message.success('关注成功')
            list[index].isFollow = !item.isFollow;
            setList([...list])
        } else {
            message.error(msg)
        }
    }
    useEffect(() => {
        if (params.id !== undefined) {
            getPostList();
        }
    }, [params.id, getPostList])
    return (
        <div className={styles.layout}>
            {
                list.map((item, index) => {
                    return <div
                        key={index}
                        className={styles.item_layout}
                    >
                        <div className={styles.user_info_layout}>
                            <Image
                                preview={false}
                                src={item.avatar}
                                width={60}
                                className={styles.avatar}
                            />
                            <p className={styles.nickname}>{item.nickname}</p>
                        </div>
                        <Button
                            type={item.isFollow ? 'default' : 'primary'}
                            className={styles.button}
                            onClick={() => handleClickFollowButton(item, index)}
                        >{item.isFollow ? '已关注' : '关注'}</Button>
                    </div>
                })
            }
        </div>
    )
}
