import React, { ChangeEventHandler, useRef, useState } from 'react'
import { Input, Button, message } from 'antd';
import styles from './style.module.scss';
import { emptyErrorText, enrollText, forgetPasswordText, httpSuccessCode, passwordErrorText, passwordReg, registerText, tokenKey, usernameErrorText, usernameReg } from 'consts';
import { IParamsType } from 'pages/login';
import { registerApi } from 'api/user';
import cookie from 'react-cookies';
import { getOverdueWithThreeDay } from 'utils';
import { useNavigate } from 'react-router-dom';

interface IRegisterProps {
    jump: (method: IParamsType) => void;
}

export default function Register({ jump }: IRegisterProps) {
    const navigate = useNavigate();
    const usernameRef = useRef<Input>(null)
    const passwordRef = useRef<Input>(null)
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('');

    // 登陆逻辑
    const handleSubmit = async () => {
        if (usernameError || passwordError) {
            message.warning('请根据提示完善信息后重试')
            return;
        }
        const username = usernameRef.current?.state.value;
        const password = passwordRef.current?.state.value;
        if (!username || !password) {
            message.warning('输入信息不能为空值');
            return;
        }
        const { code, data, message: msg } = await registerApi({
            username,
            password
        })

        if (code === httpSuccessCode) {
            message.success('登陆成功')
            cookie.save(tokenKey, data, { path: '/', expires: getOverdueWithThreeDay() });
            navigate('/')
        } else {
            message.error(msg);
        }
    }
    // 检测用户名输入
    const handleUsernameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = event.target.value;
        if (!value) {
            setUsernameError(emptyErrorText)
            return;
        }

        if (!usernameReg.test(value)) {
            setUsernameError(usernameErrorText)
        } else {
            setUsernameError('')
        }
    }

    // 检测密码输入
    const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = event.target.value;
        if (!value) {
            setPasswordError(emptyErrorText)
            return;
        }

        if (!passwordReg.test(value)) {
            setPasswordError(passwordErrorText)
        } else {
            setPasswordError('')
        }
    }
    return (
        <>
            <Input
                allowClear
                ref={usernameRef}
                placeholder='请输入账号'
                className={styles.input}
                onChange={handleUsernameChange}
                defaultValue=""
            />
            {usernameError && <p className={styles.error_text}>{usernameError}</p>}
            <Input.Password
                allowClear
                ref={passwordRef}
                placeholder='请输入密码'
                className={styles.input}
                onChange={handlePasswordChange}
                defaultValue=""
            />
            {passwordError && <p className={styles.error_text}>{passwordError}</p>}

            <Button onClick={handleSubmit} className={styles.button} type="primary">{registerText}</Button>

            <div
                className={styles.another_operation_layout}
            >
                <p onClick={() => jump('enroll')} className={styles.another_operation_text}>{enrollText}</p>
                <p onClick={() => jump('forget')} className={styles.another_operation_text}>{forgetPasswordText}</p>
            </div>
        </>
    )
}
