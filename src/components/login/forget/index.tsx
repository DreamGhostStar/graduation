import React, { ChangeEventHandler, useRef, useState } from 'react'
import { Input, Button, message } from 'antd';
import styles from './style.module.scss';
import { emptyErrorText, enrollText, httpSuccessCode, passwordErrorText, passwordReg, registerText, resetPasswordText, tokenKey, usernameErrorText, usernameReg, verifyPasswordErrorText } from 'consts';
import { IParamsType } from 'pages/login';
import { resetPasswordWithNoLoginApi } from 'api/user';
import cookie from 'react-cookies';
import { getOverdueWithThreeDay } from 'utils';
import { useNavigate } from 'react-router-dom';

interface IForgetPasswordProps {
    jump: (method: IParamsType) => void;
}

export default function ForgetPassword({ jump }: IForgetPasswordProps) {
    const navigate = useNavigate();
    const usernameRef = useRef<Input>(null)
    const passwordRef = useRef<Input>(null)
    const verificationRef = useRef<Input>(null)
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('');
    const [verifyPasswordError, seVerifyPasswordError] = useState('');
    // 重置密码逻辑
    const handleSubmit = async () => {
        if (usernameError || passwordError || verifyPasswordError) {
            message.warning('请根据提示完善信息后重试')
            return;
        }
        const username = usernameRef.current?.state.value;
        const password = passwordRef.current?.state.value;
        const verification = verificationRef.current?.state.value;
        if (!username || !password || !verification) {
            message.warning('输入信息不能为空值')
            return;
        }
        const { code, data, message: msg } = await resetPasswordWithNoLoginApi({
            username,
            afterPassword: password
        })

        if (code === httpSuccessCode) {
            message.success('重置密码成功')
            cookie.save(tokenKey, data, { path: '/', expires: getOverdueWithThreeDay() });
            navigate('/login/register')
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

    // 检测确认密码输入
    const handleVerifyPasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = event.target.value;
        if (!value) {
            seVerifyPasswordError(emptyErrorText)
            return;
        }

        if (passwordRef.current?.state.value && passwordRef.current?.state.value !== value) {
            seVerifyPasswordError(verifyPasswordErrorText)
        } else {
            seVerifyPasswordError('')
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
                placeholder='请输入重置密码'
                className={styles.input}
                onChange={handlePasswordChange}
                defaultValue=""
            />
            {passwordError && <p className={styles.error_text}>{passwordError}</p>}

            <Input.Password
                allowClear
                ref={verificationRef}
                placeholder='请确认重置密码'
                className={styles.input}
                onChange={handleVerifyPasswordChange}
                defaultValue=""
            />
            {verifyPasswordError && <p className={styles.error_text}>{verifyPasswordError}</p>}

            <Button onClick={handleSubmit} className={styles.button} type="primary">{resetPasswordText
        }</Button>
            <div
                className={styles.another_operation_layout}
            >
                <p onClick={() => jump('register')} className={styles.another_operation_text}>{registerText}</p>
                <p onClick={() => jump('enroll')} className={styles.another_operation_text}>{enrollText}</p>
            </div>
        </>
    )
}
