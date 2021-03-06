import { Button, Image, Input, message } from 'antd';
import { alterBaseUserInfoApi, uploadImageApi } from 'api/user';
import { baseSettingArr, emptyErrorText, httpSuccessCode, IBaseSettingItem } from 'consts';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { IStoreConfig } from 'redux/action-types';
import { useDispatch } from 'react-redux';
import { USER_DATA } from 'redux/action-types';
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
    const dispatch = useDispatch();
    const [username, setUsername] = useState('')
    const [nickname, setNickname] = useState('')
    const [introduction, setIntroduction] = useState('')
    const [avatar, setAvatar] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [nicknameError, setNicknameError] = useState('')
    const fileInput = useRef<HTMLInputElement>(null)

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

    // ??????????????????????????????
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

    // ????????????
    const handleSubmit = async () => {
        if (usernameError || nicknameError) {
            message.warning("????????????????????????????????????")
            return;
        }

        if (!username || !nickname || !introduction || !avatar) {
            message.warning("??????????????????");
            return;
        }
        const { code, message: msg, data } = await alterBaseUserInfoApi({
            username,
            nickname,
            introduction,
            avatar
        });

        if (code === httpSuccessCode) {
            dispatch({ type: USER_DATA, data });
            message.success('????????????')
        } else {
            message.error(msg)
        }
    }
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const file = files[0];
            const { errNo, data, message: msg } = await uploadImageApi(file);
            if (errNo === httpSuccessCode) {
                setAvatar(data.url);
                if (fileInput.current) {
                    fileInput.current.value = ''
                }
            } else {
                message.error(msg);
            }
        }
    }
    const handleClickAvatar = () => {
        if (fileInput.current) {
            fileInput.current.click()
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
                    <Button className={styles.button} type="primary" onClick={handleSubmit}>??????</Button>
                </div>
                <div className={styles.avatar_layout}>
                    <p>????????????</p>
                    <Image
                        preview={false}
                        className={styles.avatar}
                        width={100}
                        src={avatar}
                        onClick={handleClickAvatar}
                    />
                    <input
                        data-testid='file-input'
                        type="file"
                        className='youchen-file-input'
                        style={{
                            display: 'none'
                        }}
                        ref={fileInput}
                        onChange={handleFileChange}
                    />
                </div>
            </div>
        </div>
    )
}