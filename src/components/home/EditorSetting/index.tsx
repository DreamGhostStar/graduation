import { IDomEditor } from '@wangeditor/editor';
import { Button, Drawer, message, Select } from 'antd'
import { addCaseApi, alterCaseInfoApi } from 'api/case';
import { addPostApi, alterPostsInfoApi } from 'api/posts';
import { httpSuccessCode } from 'consts';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { IStoreConfig } from 'redux/action-types';
import { IEditorType } from '../myEditor';
import styles from './style.module.scss'

interface IEditorSettingProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    type: IEditorType;
    title: string;
    editor: IDomEditor | null;
    id: number | undefined;
    handleSelectChange: (value: IEditorType) => void;
    clear: () => void;
}

const { Option } = Select;

export default function EditorSetting({
    visible,
    setVisible,
    type,
    title,
    editor,
    id,
    handleSelectChange,
    clear
}: IEditorSettingProps) {
    const user = useSelector((state: IStoreConfig) => state.user);
    const [visitStatus, setVisitStatus] = useState('open')
    const onClose = () => {
        setVisible(false)
    }
    const handleVisitSelectChange = (value: string) => {
        setVisitStatus(value)
    }
    const handleSubmit = async () => {
        const content = editor?.getHtml();
        const introduction = editor?.getText();
        if (!title) {
            message.info('标题不能为空')
            return;
        }

        if (!content || !introduction) {
            message.info('内容不能为空')
            return;
        }

        let requestApi;
        if (id) {
            const requestApiMap = {
                case: alterCaseInfoApi,
                post: alterPostsInfoApi
            };
            requestApi = requestApiMap[type];
        } else {
            const requestApiMap = {
                case: addCaseApi,
                post: addPostApi
            };
            requestApi = requestApiMap[type];
        }

        const { code, message: msg } = await requestApi({
            id,
            title,
            content,
            introduction,
            visit: visitStatus
        });

        if (code === httpSuccessCode) {
            message.success(id !== undefined ? '修改成功' : '发布成功');
            clear();
            setVisitStatus('open')
            setVisible(false)
        } else {
            message.error(msg);
        }
    }
    return (
        <div>
            <Drawer
                title="设置"
                placement='right'
                closable={false}
                onClose={onClose}
                visible={visible}
                key='right'
            >
                <div className={styles.item_layout}>
                    <p>文章类型：</p>
                    <Select
                        value={type}
                        style={{ width: 120 }}
                        onChange={handleSelectChange}
                        disabled={id !== undefined}
                    >
                        <Option value="case">案件</Option>
                        <Option value="post">贴子</Option>
                    </Select>
                </div>
                <div className={styles.item_layout}>
                    <p>是否私有：</p>
                    <Select
                        value={visitStatus}
                        style={{ width: 160 }}
                        onChange={handleVisitSelectChange}
                        disabled={id !== undefined}
                    >
                        <Option value="open">公开</Option>
                        {
                            type === 'case'
                            && user?.office
                            && <Option value={user.office.id}>{user.office?.value}</Option>
                        }
                    </Select>
                </div>
                <div className={styles.submit_layout}>
                    <Button
                        onClick={handleSubmit}
                        type='primary'
                    >
                        {id !== undefined ? '修改' : '发布'}
                    </Button>
                </div>
            </Drawer>
        </div>
    )
}
