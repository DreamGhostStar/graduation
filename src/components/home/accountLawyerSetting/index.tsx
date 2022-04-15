import { AutoComplete, Button, message } from 'antd';
import { applyGetIntoOfficeApi, IOfficeItem, searchOfficeInfoApi } from 'api/office';
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
    const [inputValue, setInputValue] = useState('')
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
    // 自动完成组件选择回调
    const onSelect = (_data: string, option: IOfficeItem) => {
        setOffice(option)
    };
    // 监听变化
    const onChange = (value: string) => {
        setInputValue(value)
    }
    // 申请进入律师事务所
    const applyOffice = async () => {
        if (!office) {
            message.warning('信息不能为空');
            return;
        }
        const { code, message: msg } = await applyGetIntoOfficeApi({
            id: office.id
        });
        if (code === httpSuccessCode) {
            message.success('申请成功');
        } else {
            message.error(msg);
        }
    }

    useEffect(() => {
        if (user) {
            setOccupation(user.occupation!)
            if(user.office) {
                setInputValue(user.office.value)
                setOffice(user.office)
            }
        }
    }, [user, user?.occupation, user?.office])

    return (
        <div className={styles.layout}>
            <h4 className={styles.title}>{title}</h4>

            <div className={styles.input_layout}>
                <div className={styles.occupation_layout}>
                    <p>职业：{occupation || '未认证'}</p>
                </div>
                <div className={styles.input_item_layout}>
                    <div className={styles.input_title_layout}>
                        <p className={styles.title_sign}>*</p>
                        <p className={styles.input_title}>律师事务所 </p>
                        {
                            user?.office && <p>: {user.office.value}</p>
                        }
                    </div>
                    <div className={styles.info_layout}>
                        <AutoComplete
                            value={inputValue}
                            options={options}
                            style={{ width: 200 }}
                            onSelect={onSelect}
                            onSearch={onSearch}
                            onChange={onChange}
                        />
                        <Button
                            type='primary'
                            className={styles.apply_button}
                            onClick={applyOffice}
                        >
                            申请进入
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
