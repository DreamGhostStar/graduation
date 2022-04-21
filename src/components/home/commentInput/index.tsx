import { Input, message } from 'antd'
import { addCommentApi, IChildrenComment, IGetPostCommentListResponse } from 'api/comment';
import classNames from 'classnames';
import { httpSuccessCode } from 'consts';
import { BaseEmoji, Picker } from 'emoji-mart';
import React, { ChangeEvent, useState, KeyboardEvent } from 'react'
import { MyIcon } from 'utils';
import styles from './style.module.scss';

interface ICommentInputProps {
    isCommentIndex: number | null;
    index: number;
    listItem: IGetPostCommentListResponse | IChildrenComment;
    handleClickEmoji: (index: number) => void;
    isEmojiIndex: number | null;
    postID?: number;
    clear: () => void;
    list: IGetPostCommentListResponse[] | IChildrenComment[];
    firstIndex: number | undefined;
    setList: React.Dispatch<React.SetStateAction<IGetPostCommentListResponse[] | IChildrenComment[]>>;
    topCommentId?: number;
}

export default function CommentInput({
    isCommentIndex,
    index,
    listItem,
    handleClickEmoji,
    isEmojiIndex,
    postID,
    clear,
    list,
    firstIndex,
    setList,
    topCommentId
}: ICommentInputProps) {
    const [inputValue, setInputValue] = useState('')
    // 处理选择表情事件
    const handleSelectEmoji = (emoji: BaseEmoji) => {
        setInputValue(inputValue + emoji.native)
    }
    // 处理输入框变化事件
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
    }
    // 处理回车发送评论事件
    const handlePressEnter = async (event: KeyboardEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        // 判空处理
        if (postID === undefined) {
            return;
        }
        const {code, data, message: msg} = await addCommentApi({
            postID: postID,
            value,
            replyCommentID: listItem.id,
            topCommentID: topCommentId
        })

        console.log(listItem);
        if (code === httpSuccessCode) {
            message.success('发表成功')
            // 清除数据
            clear();
            setInputValue('')
            // 如果为首条评论，需在children中加入，否则在list中加入
            if (firstIndex !== undefined) {
                (list as IChildrenComment[]).push(data as IChildrenComment);
                setList([...list as IChildrenComment[]])
            } else {
                (listItem as IGetPostCommentListResponse).children.push(data as IChildrenComment);
                setList([...list as IGetPostCommentListResponse[]])
            }
        } else {
            message.error(msg);
        }
    }
    return (
        <>
            <Input
                className={classNames(styles.input, {
                    [styles.input_show]: isCommentIndex === index
                })}
                placeholder={`回复${listItem.author.name}`}
                value={inputValue}
                onChange={handleInputChange}
                onPressEnter={handlePressEnter}
            />
            <div className={styles.emoji_layout}>
                <div
                    className={classNames(styles.emoji_icon_layout, {
                        [styles.emoji_icon_layout_show]: isCommentIndex === index,
                        [styles.emoji_icon_layout_active]: isEmojiIndex === index
                    })}
                    onClick={() => handleClickEmoji(index)}
                >
                    <MyIcon type='icon-biaoqing-xue' className={styles.emoji_icon} />
                    <p className={styles.emoji_text}>表情</p>
                </div>
                {isEmojiIndex === index && isCommentIndex === index
                    && <div
                        className={styles.emoji}
                    >
                        <Picker
                            onSelect={handleSelectEmoji}
                            include={[
                                'people'
                            ]}
                        />
                    </div>
                }
            </div>
        </>
    )
}
