import { Divider, Modal } from 'antd';
import React, { useState } from 'react'
import { MyIcon } from 'utils'
import styles from './style.module.scss';
import cookie from 'react-cookies';
import { tokenKey } from 'consts';
import { useNavigate } from 'react-router';
import AccountSetting from '../accountSetting';
import { useSelector } from 'react-redux';
import { IStoreConfig } from 'redux/action-types';

export default function AvatarTip() {
    const user = useSelector((state: IStoreConfig) => state.user);
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate();
    const handleExit = () => {
        cookie.remove(tokenKey);
        navigate('/login/register');
    }
    // 进入我的页面
    const entryMyPage = () => {
        navigate(`/user/${user.id}`);
    }
    return (
        <>
            <Modal
                visible={visible}
                footer={null}
                width={800}
                onCancel={() => setVisible(false)}
                bodyStyle={{
                    padding: 0
                }}
            >
                <AccountSetting />
            </Modal>
            <div>
                <div className={styles.row_layout} onClick={() => setVisible(true)}>
                    <MyIcon className={styles.icon} type="icon-shezhi" />
                    <p className={styles.text}>账号设置</p>
                </div>
                <Divider className={styles.divider} />
                <div className={styles.row_layout} onClick={entryMyPage}>
                    <MyIcon className={styles.icon} type="icon-wode" />
                    <p className={styles.text}>我的页面</p>
                </div>
                <Divider className={styles.divider} />
                <div className={styles.row_layout} onClick={handleExit}>
                    <MyIcon className={styles.icon} type="icon-h" />
                    <p className={styles.text}>退出登陆</p>
                </div>
            </div>
        </>
    )
}
