import { message } from 'antd';
import { getPostsListByUserIDApi, IPostListPropsType, IPostsItem } from 'api/posts';
import { httpSuccessCode } from 'consts';
import { IMyParams } from 'pages/my';
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { MyIcon } from 'utils';
import styles from './style.module.scss';

interface IPostListProps {
  type: IPostListPropsType;
}

export default function PostList({ type }: IPostListProps) {
  const params = useParams<IMyParams>();
  const [list, setList] = useState<IPostsItem[]>([])
  const getPostList = useCallback(async () => {
    const { code, data, message: msg } = await getPostsListByUserIDApi({
      userID: parseInt(params.id!),
      type
    });

    if (code === httpSuccessCode) {
      setList(data);
    } else {
      message.error(msg);
    }
  }, [params.id, type])
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
            <div className={styles.operation_layout}>
              <div className={styles.operation_item}>
                <MyIcon
                  type='icon-dianzan_kuai'
                  className={styles.operation_icon}
                />
                <p className={styles.operation_number}>{item.goodNumber}</p>
              </div>
              <div className={styles.operation_item}>
                <MyIcon
                  type='icon-pinglun1'
                  className={styles.operation_icon}
                />
                <p className={styles.operation_number}>{item.messageNumber}</p>
              </div>
              <div className={styles.operation_item}>
                <MyIcon
                  type='icon-guanzhu-yiguanzhu'
                  className={styles.operation_icon}
                />
                <p className={styles.operation_number}>{item.collectNumber}</p>
              </div>
            </div>
          </div>
        })
      }
    </div>
  )
}
