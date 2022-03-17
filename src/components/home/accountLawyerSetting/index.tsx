import { AutoComplete, Button, message } from 'antd';
import { IOfficeItem, searchOfficeInfoApi } from 'api/office';
import { alterUserLawyerInfoApi } from 'api/user';
import { httpSuccessCode } from 'consts';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { IStoreConfig } from 'redux/action-types';
import styles from './style.module.scss';

interface IAccountLawyerSettingProps {
    title: string;
}

export default function AccountLawyerSetting({ title }: IAccountLawyerSettingProps) {
    const user = useSelector((state: IStoreConfig) => state.user);
    // 职业
    const [occupation, setOccupation] = useState('')
    const [options, setOptions] = useState<IOfficeItem[]>([])
    const [office, setOffice] = useState<IOfficeItem | null>(null)
    const onSearch = async (searchText: string) => {
        const { code, data, message: msg } = await searchOfficeInfoApi({
            word: searchText
        });
        if (code === httpSuccessCode) {
            setOptions(data)
        } else {
            message.error(msg);
        }
    };
    // 保存信息
    const handleSubmit = async () => {
        if (!office) {
            message.warning('信息不能为空');
            return;
        }
        const { code, message: msg } = await alterUserLawyerInfoApi({
            officeID: office.id
        });

        if (code === httpSuccessCode) {
            message.success('修改成功');
        } else {
            message.error(msg)
        }
    }
    // 自动完成组件选择回调
    const onSelect = (_data: string, option: IOfficeItem) => {
        setOffice(option)
    };
    const gotoaAuthentication = () => {
        // TODO: 切换进入认证页面
    }

    useEffect(() => {
        setOccupation(user.occupation!)
        setOffice(user.office || null)
    }, [user.occupation, user.office])

    return (
        <div className={styles.layout}>
            <h4 className={styles.title}>{title}</h4>

            <div className={styles.input_layout}>
                <div className={styles.occupation_layout}>
                    <p>职业：{occupation || '未认证'}</p>
                    <Button>去认证</Button>
                </div>
                <div className={styles.input_item_layout}>
                    <div className={styles.input_title_layout}>
                        <p className={styles.title_sign}>*</p>
                        <p className={styles.input_title}>律师事务所</p>
                    </div>
                    <AutoComplete
                        value={office ? office.value : ''}
                        options={options}
                        style={{ width: 200 }}
                        onSelect={onSelect}
                        onSearch={onSearch}
                    />
                </div>
                <Button
                    type="primary"
                    className={styles.button}
                    onClick={handleSubmit}
                >保存</Button>
            </div>
        </div>
    )
}
