import { message } from 'antd';
import { getCaseListApi, ICaseItem } from 'api/case';
import { httpSuccessCode } from 'consts';
import { IMyParams } from 'pages/my';
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import styles from './style.module.scss';

export default function CaseList() {
    const params = useParams<IMyParams>();
    const [list, setList] = useState<ICaseItem[]>([]);
    const getPostList = useCallback(async () => {
        const { code, data, message: msg } = await getCaseListApi({
            userID: parseInt(params.id!)
        });

        if (code === httpSuccessCode) {
            setList(data.list);
        } else {
            message.error(msg);
        }
    }, [params.id])
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
                        <div className={styles.header}>
                            <p className={styles.header_text}>{item.author.name}</p>
                            <p className={styles.header_text}>{item.createTime}</p>
                        </div>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.content}>{item.content}</p>
                    </div>
                })
            }
        </div>
    )
}
