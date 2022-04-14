import { message, Image, Input, Button } from 'antd';
import { addCommentApi, getPostCommentListApi, goodPostCommentApi, IChildrenComment, IGetPostCommentListResponse } from 'api/comment';
import { httpSuccessCode } from 'consts';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { MyIcon } from 'utils';
import styles from './style.module.scss';
import 'emoji-mart/css/emoji-mart.css';
import CommentInput from '../commentInput';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { IStoreConfig } from 'redux/action-types';
import { BaseEmoji, Picker } from 'emoji-mart';

const { TextArea } = Input;

interface IComment {
    postID: number;
    children?: IChildrenComment[];
    firstIndex?: number;
}

export default function Comment({ postID, children = [], firstIndex }: IComment) {
    const user = useSelector((state: IStoreConfig) => state.user);
    const [list, setList] = useState<IGetPostCommentListResponse[] | IChildrenComment[]>(children)
    const [isCommentIndex, setIsCommentIndex] = useState<number | null>(null)
    const [isEmojiIndex, setIsEmojiIndex] = useState<number | null>(null)
    const [isEmojiActive, setIsEmojiActive] = useState(false)
    const [firstInputValue, setFirstInputValue] = useState('')

    const getPostCommentInfo = useCallback(async () => {
        if (!postID) {
            return;
        }
        if (firstIndex !== undefined) {
            return;
        }
        const { code, data, message: msg } = await getPostCommentListApi({
            id: postID
        });

        if (code === httpSuccessCode) {
            setList(data)
        } else {
            message.error(msg);
        }
    }, [firstIndex, postID])
    // 生成评论数或者是评论文本
    const buildCommentNumber = (
        item: IGetPostCommentListResponse | IChildrenComment,
        index: number
    ) => {
        const commonReplyText = '回复';
        if (isCommentIndex === index) {
            return '取消回复';
        }
        if (childrenIsFirstComment(item)) {
            return item.children.length || commonReplyText
        } else {
            return commonReplyText;
        }
    }
    // 判断是否是首条评论
    const childrenIsFirstComment = (props: IGetPostCommentListResponse | IChildrenComment): props is IGetPostCommentListResponse => {
        return (props as IGetPostCommentListResponse).children !== undefined;
    }
    // 判断是否是子评论
    const childrenIsChildrenComment = (props: IGetPostCommentListResponse | IChildrenComment): props is IChildrenComment => {
        return (props as IGetPostCommentListResponse).children === undefined;
    }
    // 构建回复作者部分
    const buildReplyLayout = (item: IGetPostCommentListResponse | IChildrenComment) => {
        if (childrenIsChildrenComment(item)) {
            const replyAuthorName = item.replyAuthor.name;
            return <>
                <p className={styles.reply_text}>回复</p>
                <p className={styles.author_name}>{replyAuthorName}</p>
            </>
        } else {
            return <></>
        }
    }
    // 处理点击评论事件
    const handleClickComment = (index: number) => {
        setIsCommentIndex(isCommentIndex === index ? null : index);
    }
    // 处理点击表情事件
    const handleClickEmoji = (index: number) => {
        setIsEmojiIndex(isEmojiIndex === index ? null : index);
    }
    // 点赞/取消点赞评论
    const goodComment = async (
        item: IGetPostCommentListResponse | IChildrenComment,
        firstColumnIndex: number | undefined,
        index: number
    ) => {
        // 初始点赞状态
        let initialGoodStatus = item.isGood;
        if (firstColumnIndex === undefined) {
            list[index].isGood = !initialGoodStatus;
        } else {
            list[index].isGood = !initialGoodStatus;
        }
        let updateList = [...list];
        setList(updateList as IGetPostCommentListResponse[] | IChildrenComment[])
        const { code, message: msg } = await goodPostCommentApi({
            id: item.id,
            isGood: !initialGoodStatus
        });
        if (code !== httpSuccessCode) {
            list[index].isGood = initialGoodStatus;
            setList(list)
            message.error(msg)
        }
    }
    // 清空评论index和表情index的记录
    const clear = () => {
        setIsCommentIndex(null)
        setIsEmojiIndex(null)
    }
    // 处理首个评论输入框的表情选择事件
    const handleSelectEmoji = (emoji: BaseEmoji) => {
        setFirstInputValue(firstInputValue + emoji.native);
    }
    // 处理首个输入框输入变化
    const handleFirstInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.currentTarget.value;
        setFirstInputValue(value);
    }
    // 处理首个输入框按下Enter后的事件
    const handleFirstInputPress = () => {
        handleFirstInputSubmit()
    }
    const handleFirstInputSubmit = async () => {
        const { code, data, message: msg } = await addCommentApi({
            postID,
            value: firstInputValue
        })

        if (code === httpSuccessCode) {
            (list as IGetPostCommentListResponse[]).push((data as IGetPostCommentListResponse));
            setFirstInputValue('');
            setIsEmojiActive(false);
            setList([...list as IGetPostCommentListResponse[]])
            console.log(list);
        } else {
            message.error(msg)
        }
    }
    useEffect(() => {
        getPostCommentInfo()
    }, [getPostCommentInfo, postID])

    return (
        <div className={styles.layout}>
            {
                firstIndex === undefined &&
                <div className={styles.first_layout}>
                    <h3 className={styles.title}>全部评论</h3>
                    <div className={styles.first_comment_input_layout}>
                        <Image
                            preview={false}
                            src={user.avatar}
                            className={styles.avatar}
                            width={50}
                        />
                        <TextArea
                            rows={4}
                            className={styles.first_comment_input}
                            placeholder='输入评论（Enter换行）'
                            value={firstInputValue}
                            onChange={handleFirstInputChange}
                            onPressEnter={handleFirstInputPress}
                        />
                    </div>
                    <div className={styles.first_operation_layout}>
                        <div
                            className={classNames(styles.emoji_layout, {
                                [styles.emoji_layout_active]: isEmojiActive
                            })}
                            onClick={() => setIsEmojiActive(!isEmojiActive)}
                        >
                            <MyIcon type='icon-biaoqing-xue' className={styles.emoji_icon} />
                            <p className={styles.emoji_text}>表情</p>
                        </div>
                        <Button
                            type='primary'
                            onClick={handleFirstInputSubmit}
                        >发表评论</Button>
                    </div>
                    <div
                        className={classNames(styles.emoji, {
                            [styles.emoji_show]: isEmojiActive
                        })}
                    >
                        <Picker
                            onSelect={handleSelectEmoji}
                            include={[
                                'people'
                            ]}
                        />
                    </div>
                </div>
            }
            <div className={styles.comment_layout}>
                {
                    list.map((listItem, index) => {
                        return <div
                            key={index}
                            className={styles.list_item_layout}
                        >
                            <div className={styles.author_layout}>
                                <div className={styles.author_info_layout}>
                                    <Image
                                        preview={false}
                                        className={styles.avatar}
                                        width={30}
                                        src={listItem.author.avatar}
                                    />
                                    <p className={styles.author_name}>{listItem.author.name}</p>
                                    {buildReplyLayout(listItem)}
                                </div>
                                <p >{listItem.time}</p>
                            </div>
                            <div className={styles.content_layout}>
                                <p className={styles.content}>{listItem.content}</p>
                                <div className={styles.operation_layout}>
                                    <div
                                        className={styles.operation_item_layout}
                                        onClick={() => goodComment(listItem, firstIndex, index)}
                                    >
                                        <MyIcon
                                            className={`${styles.operation_icon} ${listItem.isGood && styles.operation_active_icon}`}
                                            type="icon-dianzan_kuai"
                                        />
                                        <span className={styles.operation_text}>{listItem.goodNumber || '点赞'}</span>
                                    </div>
                                    <div
                                        className={classNames(styles.operation_item_layout, {
                                            [styles.operation_active_comment]: isCommentIndex === index
                                        })}
                                        onClick={() => handleClickComment(index)}
                                    >
                                        <MyIcon
                                            className={classNames(styles.operation_icon, {
                                                [styles.operation_active_comment_icon]: isCommentIndex === index
                                            })}
                                            type={isCommentIndex === index ? 'icon-pinglun1' : "icon-pinglun"}
                                        />
                                        <span className={styles.operation_text}>
                                            {buildCommentNumber(listItem, index)}
                                        </span>
                                    </div>
                                </div>
                                <CommentInput
                                    index={index}
                                    isCommentIndex={isCommentIndex}
                                    isEmojiIndex={isEmojiIndex}
                                    handleClickEmoji={handleClickEmoji}
                                    listItem={listItem}
                                    postID={postID}
                                    clear={clear}
                                    list={list}
                                    firstIndex={firstIndex}
                                    setList={setList}
                                />
                            </div>
                            {
                                childrenIsFirstComment(listItem) 
                                && listItem.children.length > 0 
                                && <div className={styles.children_layout}>
                                    <Comment
                                        postID={postID}
                                        children={listItem.children}
                                        firstIndex={index}
                                    />
                                </div>
                            }
                        </div>
                    })
                }
            </div>
        </div>
    )
}
