import { Button, Input, message } from 'antd';
import { resetPasswordWithLoginApi } from 'api/user';
import { emptyErrorText, httpSuccessCode, passwordErrorText, passwordReg } from 'consts';
import React, { useState } from 'react'
import styles from './style.module.scss';
import md5 from 'md5';

interface IAlterPasswordProps {
    title: string;
}

export default function AlterPassword({ title }: IAlterPasswordProps) {
    const [beforePassword, setBeforePassword] = useState('')
    const [afterVerifyPassword, setAfterVerifyPassword] = useState('')
    const [beforePasswordError, setBeforePasswordError] = useState('')
    const [afterPasswordError, setAfterPasswordError] = useState('')

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        alterFun: React.Dispatch<React.SetStateAction<string>>,
        alterErrorFun: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const value = event.target.value;
        alterFun(value)

        if (!value) {
            alterErrorFun(emptyErrorText);
            return;
        }

        if (passwordReg.test(value)) {
            alterErrorFun("")
        } else {
            alterErrorFun(passwordErrorText)
        }
    }

    const handleSubmit = async () => {
        if (beforePasswordError || afterPasswordError) {
            message.warning("请按照提示完善信息后重试")
            return;
        }

        if (!beforePassword || !afterVerifyPassword) {
            message.warning("信息不能为空");
            return;
        }
        const { code, message: msg } = await resetPasswordWithLoginApi({
            beforePassword: md5(beforePassword),
            afterPassword: md5(afterVerifyPassword)
        })

        if (code === httpSuccessCode) {
            message.success('修改成功')
        } else {
            message.error(msg);
        }
    }

    return (
        <div className={styles.layout}>
            <h4 className={styles.title}>{title}</h4>

            <div className={styles.input_layout}>
                <div className={styles.input_item_layout}>
                    <p>旧密码</p>
                    <Input
                        allowClear
                        className={styles.input}
                        onChange={(event) => handleInputChange(event, setBeforePassword, setBeforePasswordError)}
                        value={beforePassword}
                    />
                    <p className={styles.error_text}>{beforePasswordError}</p>
                </div>
                <div className={styles.input_item_layout}>
                    <p>新密码</p>
                    <Input
                        allowClear
                        className={styles.input}
                        onChange={(event) => handleInputChange(event, setAfterVerifyPassword, setAfterPasswordError)}
                        value={afterVerifyPassword}
                    />
                    <p className={styles.error_text}>{afterPasswordError}</p>
                </div>
                <Button type="primary" onClick={handleSubmit}>保存</Button>
            </div>
        </div>
    )
}
