import React from 'react'
import styles from './style.module.scss';
import { projectName } from 'consts';
import Register from 'components/login/register';
import Enroll from 'components/login/enroll';
import logo from 'images/logo.png';
import { Image } from 'antd';
import { useNavigate, useParams } from 'react-router';
import ForgetPassword from 'components/login/forget';

export type IParamsType = 'register' | 'enroll' | 'forget'
interface IParams {
    type: IParamsType;
    [key: string]: IParamsType;
}

export default function Login() {
    const params = useParams<IParams>();
    const navigate = useNavigate();

    const handleJumpEnroll = (method: IParamsType) => {
        navigate(`/login/${method}`)
    }
    // 构建主要的页面框架
    const buildMainElement = () => {
        // 输入框map
        const mainMap = {
            register: <Register jump={handleJumpEnroll} />,
            enroll: <Enroll jump={handleJumpEnroll} />,
            forget: <ForgetPassword jump={handleJumpEnroll} />
        }
        const type = params.type || 'register';
        return (mainMap[type])
    }

    return (
        <div className={styles.layout}>
            <div className={styles.main}>
                <div className={styles.image_layout}>
                    <Image
                        className={styles.logo}
                        preview={false}
                        width={60}
                        src={logo}
                    />
                    <p className={styles.project_name}>{projectName}</p>
                </div>

                {buildMainElement()}
            </div>
        </div>
    )
}
