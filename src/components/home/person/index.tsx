import { Empty, message, Select, Space, Table, Image, Badge, Modal, Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { getOfficeJoinInfoApi, getOfficePersonInfoApi, IGetOfficeJoinInfoResponse, IJoinOfficeStatus, IOfficeIdentity, removeOfficePersonApi, sendJoinStatusApi } from 'api/office';
import { alterUserIdentityApi, alterUserLawyerInfoApi } from 'api/user';
import { httpSuccessCode } from 'consts';
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { IStoreConfig, IUserConfig } from 'redux/action-types';
import { MyIcon } from 'utils';
import styles from './style.module.scss';
const { Option } = Select;

type IPersonItem = IUserConfig & {
    key?: number;
    officeIdentity?: IOfficeIdentity;
}
const statusMap = {
    agree: '同意',
    refuse: '拒绝',
    pending: '未决定'
}

export default function Person() {
    const user = useSelector((state: IStoreConfig) => state.user);
    const [list, setList] = useState<IPersonItem[]>([])
    const [joinList, setJoinList] = useState<IGetOfficeJoinInfoResponse[]>([])
    const [visible, setVisible] = useState(false)
    // 监听职业的变化
    const handleSelectOccupationChange = async (
        value: string | null,
        record: IPersonItem,
        index: number
    ) => {
        const { code, data, message: msg } = await alterUserLawyerInfoApi({
            occupation: value,
            userID: record.id
        });
        if (code === httpSuccessCode) {
            list[index].occupation = data.occupation;
            setList([...list]);
            message.success('修改成功')
        } else {
            message.error(msg);
        }
    }
    // 监听身份的变化
    const handleSelectIdentityChange = async (
        value: IOfficeIdentity,
        record: IPersonItem,
        index: number
    ) => {
        const { code, data, message: msg } = await alterUserIdentityApi({
            userID: record.id!,
            identity: value
        });
        if (code === httpSuccessCode) {
            list[index].office = data.office;
            list[index].officeIdentity = data.office?.identity;
            setList([...list]);
            message.success('修改成功')
        } else {
            message.error(msg);
        }
    }
    // 移除用户
    const handleRemoveUser = async (record: IPersonItem, index: number) => {
        const { code, message: msg } = await removeOfficePersonApi({
            userID: record.id!
        });
        if (code === httpSuccessCode) {
            list.splice(index, 1);
            setList([...list])
            message.success('删除成功');
        } else {
            message.error(msg)
        }
    }
    // 处理加入事务所请求
    const handleJoinStatus = async (
        id: number,
        status: IJoinOfficeStatus,
        joinIndex: number
    ) => {
        const { code, data, message: msg } = await sendJoinStatusApi({
            id,
            status
        });
        if (code === httpSuccessCode) {
            if (status === 'agree') {
                list.push({
                    ...data,
                    key: data.id,
                    officeIdentity: data.office?.identity
                });
                setList([...list]);
            }
            joinList[joinIndex].status = status;
            setJoinList([...joinList]);
            message.success(`处理完成：${statusMap[status]}加入`)
        } else {
            message.error(msg);
        }
    }
    const columns: ColumnsType<IPersonItem> = [
        {
            title: '名字',
            dataIndex: 'nickname',
            key: 'nickname',
            render: (text, record) => {
                return <div
                    className={styles.nickname_layout}
                >
                    <Image
                        src={record.avatar}
                        preview={false}
                        className={styles.avatar}
                        width={40}
                    />
                    <p className={styles.nickname}>{text}</p>
                </div>
            },
        },
        {
            title: '职业',
            dataIndex: 'occupation',
            key: 'occupation',
            render: (text, record, index) => {
                return <div>
                    <Select
                        value={text || '无'}
                        style={{ width: 120 }}
                        onChange={(value) => handleSelectOccupationChange(value, record, index)}
                    >
                        <Option value='common'>无</Option>
                        <Option value="lawyer">律师</Option>
                    </Select>
                </div>
            }
        },
        {
            title: '身份',
            dataIndex: 'officeIdentity',
            key: 'officeIdentity',
            render: (text: IOfficeIdentity, record, index) => {
                return <div>
                    <Select
                        value={text}
                        style={{ width: 120 }}
                        onChange={(value) => handleSelectIdentityChange(value, record, index)}
                    >
                        <Option value='ordinary'>普通成员</Option>
                        <Option value="Administration">管理员</Option>
                    </Select>
                </div>
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_text, record, index) => (
                <Space size="middle">
                    <p
                        className={styles.action_text}
                        onClick={() => handleRemoveUser(record, index)}
                    >
                        删除
                    </p>
                </Space>
            ),
        },
    ];
    // 获取事务所内部所有人员信息
    const getOfficePersonInfo = useCallback(async () => {
        const { code, data, message: msg } = await getOfficePersonInfoApi({
            id: user?.office?.id!
        });
        if (code === httpSuccessCode) {
            const updateList: IPersonItem[] = [];
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                updateList.push({
                    ...item,
                    key: item.id,
                    officeIdentity: item.office?.identity
                });
            }
            setList(updateList);
        } else {
            message.success(msg);
        }
    }, [user?.office?.id])
    const getOfficeJoinMessageList = useCallback(async () => {
        const { code, data, message: msg } = await getOfficeJoinInfoApi({
            officeID: user?.office?.id!
        });
        if (code === httpSuccessCode) {
            setJoinList(data);
        } else {
            message.error(msg);
        }
    }, [user?.office?.id])
    useEffect(() => {
        getOfficePersonInfo();
        getOfficeJoinMessageList();
    }, [getOfficePersonInfo, getOfficeJoinMessageList])

    return (
        <div className={styles.layout}>
            {
                user?.office
                    ? <div className={styles.table_layout}>
                        <div className={styles.operation_layout}>
                            <Badge size="small" count={joinList.length}>
                                <MyIcon
                                    type='icon-xiaoxizhongxin'
                                    className={styles.operation_icon}
                                    onClick={() => { setVisible(true) }}
                                />
                            </Badge>
                        </div>
                        <Table
                            columns={columns}
                            dataSource={list}
                            pagination={false}
                        />
                        <Modal
                            visible={visible}
                            footer={null}
                            width={800}
                            onCancel={() => setVisible(false)}
                            bodyStyle={{
                                padding: 0
                            }}
                            title='加入事务所消息'
                        >
                            <div className={styles.join_layout}>
                                {
                                    joinList.map((joinItem, index) => {
                                        return <div
                                            key={index}
                                            className={styles.join_item_layout}
                                        >
                                            <div className={styles.join_info_layout}>
                                                <Image
                                                    src={joinItem.user.avatar}
                                                    width={40}
                                                    preview={false}
                                                    className={styles.join_avatar}
                                                />
                                                <p className={styles.join_nickname}>{joinItem.user.nickname}</p>
                                            </div>
                                            <div className={styles.button_layout}>
                                                {
                                                    joinItem.status === 'pending'
                                                        ? <>
                                                            <Button
                                                                type='primary'
                                                                className={styles.button}
                                                                onClick={() => handleJoinStatus(joinItem.id, 'agree', index)}
                                                            >
                                                                同意
                                                            </Button>
                                                            <Button
                                                                danger
                                                                className={styles.button}
                                                                onClick={() => handleJoinStatus(joinItem.id, 'refuse', index)}
                                                            >
                                                                拒绝
                                                            </Button>
                                                        </>
                                                        : <p
                                                            className={joinItem.status === 'agree' ? styles.status_agree : styles.status_refuse}
                                                        >已{statusMap[joinItem.status]}</p>
                                                }
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </Modal>
                    </div>
                    : <div className={styles.empty_status}>
                        <Empty description={false} />
                    </div>
            }
        </div>
    )
}
