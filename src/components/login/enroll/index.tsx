import React, { ChangeEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { Input, Button, message } from 'antd';
import styles from './style.module.scss';
import { emptyErrorText, enrollText, httpSuccessCode, passwordErrorText, passwordReg, tokenKey, useExistingAccountText, usernameErrorText, usernameReg } from 'consts';
import { IParamsType } from 'pages/login';
import { useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';
import { getOverdueWithThreeDay } from 'utils';
import { enrollApi, getVerifyImageApi } from 'api/user';
import md5 from 'md5';

interface IEnrollProps {
    jump: (method: IParamsType) => void;
}

export default function Enroll({ jump }: IEnrollProps) {
    const navigate = useNavigate();
    const usernameRef = useRef<Input>(null)
    const passwordRef = useRef<Input>(null)
    const verifyPasswordRef = useRef<Input>(null)
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('');
    const [verifyImage, setVerifyImage] = useState('')
    // 注册逻辑
    const handleSubmit = async () => {
        if (usernameError || passwordError) {
            message.warning('请根据提示完善信息后重试')
            return;
        }
        const username = usernameRef.current?.state.value;
        const password = md5(passwordRef.current?.state.value);
        const verification = verifyPasswordRef.current?.state.value;
        if (!username || !password || !verification) {
            message.warning('输入信息不能为空值')
            return;
        }
        const { code, data, message: msg } = await enrollApi({
            username,
            password,
            verification
        })

        if (code === httpSuccessCode) {
            message.success('注册成功')
            cookie.save(tokenKey, data, { path: '/', expires: getOverdueWithThreeDay() });
            navigate('/home/post')
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
    const getVerifyImage = useCallback(async () => {
        const { code, data, message: msg } = await getVerifyImageApi();
        if (code === httpSuccessCode) {
            setVerifyImage(data);
        } else {
            message.error(msg);
        }
    }, [])
    useEffect(() => {
        getVerifyImage();
    }, [getVerifyImage])

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
                placeholder='密码'
                className={styles.input}
                onChange={handlePasswordChange}
                defaultValue=""
            />
            {passwordError && <p className={styles.error_text}>{passwordError}</p>}

            <div className={styles.input_verify_code_layout}>
                <Input
                    allowClear
                    ref={verifyPasswordRef}
                    placeholder='请输入验证码'
                    className={styles.input_verify_code}
                    defaultValue=""
                />
                <div className={styles.verify_img} dangerouslySetInnerHTML={{ __html: verifyImage }}></div>
            </div>

            <Button onClick={handleSubmit} className={styles.button} type="primary">{enrollText}</Button>
            <div
                className={styles.another_operation_layout}
            >
                <p onClick={() => jump('register')} className={styles.another_operation_text}>{useExistingAccountText}</p>
            </div>
        </>
    )
}
