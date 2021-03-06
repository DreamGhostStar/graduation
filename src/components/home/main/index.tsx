import { Button, Image, message, Tooltip } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { collectPostsApi, goodPostsApi, IAuthor, IPostsItem } from 'api/posts';
import React, { useEffect, useState } from 'react'
import styles from './style.module.scss';
import { MyIcon } from 'utils';
import Comment from '../comment';
import { httpSuccessCode, pickCaseUserTitle } from 'consts';
import { followUserApi } from 'api/user';
import { entrustCaseApi, ICaseItem, pickUserApi } from 'api/case';
import classNames from 'classnames';
import { useNavigate } from 'react-router';

interface IMainProps {
    item?: IPostsItem | ICaseItem;
    isPostItem: (props: IPostsItem | ICaseItem) => props is IPostsItem;
    isCaseItem: (props: IPostsItem | ICaseItem) => props is ICaseItem;
    activeIndex: number;
    setList: React.Dispatch<React.SetStateAction<(IPostsItem | ICaseItem)[]>>;
    list: (IPostsItem | ICaseItem)[];
}

export default function Main({
    item,
    isPostItem,
    isCaseItem,
    activeIndex,
    setList,
    list
}: IMainProps) {
    const [isFollow, setIsFollow] = useState(false)
    const navigate = useNavigate();

    const handleClickGood = async (item: IPostsItem) => {
        const { code, message: msg } = await goodPostsApi({
            postID: item.id,
            isGood: !item.isGood
        });

        if (code === httpSuccessCode) {
            (list[activeIndex] as IPostsItem).isGood = !item.isGood;
            setList([...list])
        } else {
            message.error(msg);
        }
    }
    const followUser = async () => {
        if (!item) {
            return;
        }
        const { code, message: msg } = await followUserApi({
            userID: item.author.id,
            isFollow: !isFollow
        });

        if (code === httpSuccessCode) {
            message.success(isFollow ? '取消关注成功' : '关注成功');
            setIsFollow(!isFollow);
        } else {
            message.error(msg);
        }
    }
    // 收藏贴子
    const collectPost = async (item: IPostsItem) => {
        const { code, message: msg } = await collectPostsApi({
            postID: item.id,
            isCollect: !item.isCollect
        });

        if (code === httpSuccessCode) {
            message.success(item.isCollect ? '取消收藏成功' : '收藏成功');
            (list[activeIndex] as IPostsItem).isCollect = !item.isCollect;
            setList([...list]);
        } else {
            message.error(msg);
        }
    }
    // 处理委托案件
    const handlePick = async (item: IAuthor, index: number, caseID: number) => {
        const { code, message: msg } = await entrustCaseApi({
            userID: item.id,
            isEntrust: !item.isPick,
            caseID
        });

        if (code === httpSuccessCode) {
            message.success(item.isPick ? '取消委托成功' : '委托成功');
            (list[activeIndex] as ICaseItem).pickUser.list[index].isPick = !item.isPick;
            setList([...list]);
        } else {
            message.error(msg);
        }
    }
    // 进入修改页面
    const entryAlterPage = () => {
        if (!item) {
            message.error('系统繁忙，请稍后重试');
            return;
        }
        const type = isCaseItem(item) ? 'case' : 'post'
        navigate(`/home/edit/${type}-${item.id}`);
    }
    // 处理接取请求
    const handlePickUser = async (caseItem: ICaseItem, isPick: boolean) => {
        const {code, message: msg} = await pickUserApi({
            caseID: caseItem.id,
            isPick: !isPick
        });
        if (code === httpSuccessCode) {
            caseItem.pickUser.isPick = !isPick;
            list[activeIndex] = caseItem;
            setList([...list]);
            message.success(isPick ? '取消接取成功' : '接取成功')
        } else {
            message.error(msg);
        }
    }
    useEffect(() => {
        if (item) {
            setIsFollow(Boolean(item.isFollow));
        }
    }, [isPostItem, item])

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
                        {
                            isCaseItem(item)
                            && <p className={styles.deadline}>
                                {item.deadlineTime}
                            </p>
                        }
                        <p className={styles.content} dangerouslySetInnerHTML={{ __html: item.content }}></p>
                        {
                            item.isMy && <div className={styles.alter_layout}>
                                <Tooltip title="修改贴子">
                                    <MyIcon
                                        type="icon-cangpeitubiao_xiugaixiugaiziliao"
                                        className={styles.alter_icon}
                                        onClick={entryAlterPage}
                                    />
                                </Tooltip>
                            </div>
                        }
                        {
                            isPostItem(item) && <>
                                <Comment postID={item.id} />
                                <div className={styles.operation_layout}>
                                    <div className={styles.operation_item_layout}>
                                        <MyIcon
                                            className={`${styles.operation_icon} ${item.isGood && styles.operation_active_icon}`}
                                            type="icon-dianzan_kuai"
                                            onClick={() => handleClickGood(item)}
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
                                            className={`${styles.operation_icon} ${item.isCollect && styles.operation_active_icon}`}
                                            type="icon-guanzhu-yiguanzhu"
                                            onClick={() => collectPost(item)}
                                        />
                                        <p className={styles.number}>{item.collectNumber}</p>
                                    </div>
                                </div>
                            </>
                        }
                        {
                            isCaseItem(item) && <div>
                                {
                                    item.pickUser.isLook
                                        ? <div className={styles.look_layout}>
                                            <h2 className={styles.pick_user_title}>{pickCaseUserTitle}</h2>
                                            <div className={styles.pick_user_layout}>
                                                {
                                                    item.pickUser.list.map((pickUserItem, index) => {
                                                        return <div
                                                            key={index}
                                                            className={styles.pick_user_item_layout}
                                                        >
                                                            <Image
                                                                preview={false}
                                                                src={pickUserItem.avatar}
                                                                width={40}
                                                                className={styles.pick_user_item_avatar}
                                                            />
                                                            <p className={styles.pick_user_item_name}>{pickUserItem.name}</p>
                                                            <p className={styles.pick_user_item_introduction}>{pickUserItem.introduction}</p>
                                                            <div className={styles.pick_user_operation}>
                                                                <Tooltip placement="bottom" title='进入个人信息页面'>
                                                                    <MyIcon
                                                                        type='icon-yonghuziliaogerenxinxigerenziliao'
                                                                        className={styles.pick_user_operation_icon}
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip
                                                                    placement="bottom"
                                                                    title={pickUserItem.isPick ? '取消委托' : '接受委托'}
                                                                >
                                                                    <MyIcon
                                                                        type={pickUserItem.isPick ? 'icon-jujueweituo' : 'icon-jieshouweituo'}
                                                                        className={classNames(styles.pick_user_operation_icon, {
                                                                            [styles.pick_user_operation_icon_normal]: true,
                                                                            [styles.pick_user_operation_icon_pick]: !pickUserItem.isPick
                                                                        })}
                                                                        onClick={() => handlePick(pickUserItem, index, item.id)}
                                                                    />
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </div>
                                        : <div className={styles.pick_layout}>
                                            <Button
                                                type={item.pickUser.isPick ? 'default' : 'primary'}
                                                onClick={() => handlePickUser(item, item.pickUser.isPick, )}
                                            >
                                                {item.pickUser.isPick ? '已接取' : '接取'}
                                            </Button>
                                        </div>
                                }
                            </div>
                        }
                    </div >
                    : <div></div>
            }
        </>
    )
}
