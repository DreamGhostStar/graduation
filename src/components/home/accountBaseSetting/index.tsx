import { Button, Image, Input, message } from 'antd';
import { alterBaseUserInfoApi } from 'api/user';
import { baseSettingArr, emptyErrorText, httpSuccessCode, IBaseSettingItem } from 'consts';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { IStoreConfig } from 'redux/action-types';
import styles from './style.module.scss';

const { TextArea } = Input;

interface IAccountBaseSettingProps {
    title: string;
}

interface IValueMap {
    username: string;
    nickname: string;
    introduction: string;
    [key: string]: string;
}

interface IErrorItem {
    error: string;
    alter: React.Dispatch<React.SetStateAction<string>>;
}

interface IErrorMap {
    username: IErrorItem;
    nickname: IErrorItem;
    [key: string]: IErrorItem;
}

interface ChangeEventMap {
    username: React.Dispatch<React.SetStateAction<string>>;
    nickname: React.Dispatch<React.SetStateAction<string>>;
    introduction: React.Dispatch<React.SetStateAction<string>>;
    [key: string]: React.Dispatch<React.SetStateAction<string>>;
}

export default function AccountBaseSetting({ title }: IAccountBaseSettingProps) {
    const user = useSelector((state: IStoreConfig) => state.user);
    const [username, setUsername] = useState('')
    const [nickname, setNickname] = useState('')
    const [introduction, setIntroduction] = useState('')
    const [avatar, setAvatar] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [nicknameError, setNicknameError] = useState('')

    useEffect(() => {
        if (user) {
            setUsername(user.username!)
            setNickname(user.nickname!)
            setIntroduction(user.introduction!)
            setAvatar(user.avatar!)
        }
    }, [user?.username, user?.nickname, user?.introduction, user?.avatar, user])


    const valueMap: IValueMap = {
        username,
        nickname,
        introduction
    }

    const errorMap: IErrorMap = {
        username: {
            error: usernameError,
            alter: setUsernameError
        },
        nickname: {
            error: nicknameError,
            alter: setNicknameError
        },
    }

    // 监听输入框的输入变化
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        item: IBaseSettingItem
    ) => {
        const changeEventForVariableMap: ChangeEventMap = {
            username: setUsername,
            nickname: setNickname,
            introduction: setIntroduction
        }
        const value = event.target.value;
        changeEventForVariableMap[item.sign](value);

        if (item.isMandatory) {
            if (!value) {
                errorMap[item.sign].alter(emptyErrorText);
                return;
            } else {
                errorMap[item.sign].alter('');
            }
        }

        if (item.reg && item.errorText) {
            if (item.reg.test(value)) {
                errorMap[item.sign].alter('')
            } else {
                errorMap[item.sign].alter(item.errorText);
            }
        }

    }

    // 提交信息
    const handleSubmit = async () => {
        if (usernameError || nicknameError) {
            message.warning("请按照提示完善信息后重试")
            return;
        }

        if (!username || !nickname || !introduction || !avatar) {
            message.warning("信息不能为空");
            return;
        }
        const { code, message: msg } = await alterBaseUserInfoApi({
            username,
            nickname,
            introduction,
            avatar
        });

        if (code === httpSuccessCode) {
            message.success('保存成功')
        } else {
            message.error(msg)
        }
    }
    return (
        <div className={styles.layout}>
            <h4 className={styles.title}>{title}</h4>
            <div className={styles.main}>
                <div className={styles.input_layout}>
                    {
                        baseSettingArr.map((settingItem, index) => {
                            return (
                                <div key={index} className={styles.input_item_layout}>
                                    <div className={styles.input_title_layout}>
                                        {settingItem.isMandatory && <p className={styles.title_sign}>*</p>}
                                        <p className={styles.input_title}>{settingItem.name}</p>
                                    </div>
                                    {
                                        settingItem.sign === 'introduction'
                                            ? <TextArea
                                                rows={4}
                                                placeholder={settingItem.placeholder}
                                                onChange={(event) => handleInputChange(event, settingItem)}
                                                value={valueMap[settingItem.sign]}
                                            />
                                            : <Input
                                                allowClear
                                                placeholder={settingItem.placeholder}
                                                className={styles.input}
                                                onChange={(event) => handleInputChange(event, settingItem)}
                                                value={valueMap[settingItem.sign]}
                                            />
                                    }
                                    {
                                        settingItem.sign !== 'introduction'
                                        && <p className={styles.error_text}>{errorMap[settingItem.sign].error}</p>
                                    }
                                </div>
                            )
                        })
                    }
                    <Button className={styles.button} type="primary" onClick={handleSubmit}>保存</Button>
                </div>
                <div className={styles.avatar_layout}>
                    <p>个人头像</p>
                    <Image
                        preview={false}
                        className={styles.avatar}
                        width={100}
                        src={user?.avatar}
                    />
                </div>
            </div>
        </div>
    )
}
