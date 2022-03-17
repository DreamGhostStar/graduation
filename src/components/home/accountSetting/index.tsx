import { settingSideBarArr } from 'consts';
import React, { useState } from 'react'
import AccountBaseSetting from '../accountBaseSetting';
import AccountLawyerSetting from '../accountLawyerSetting';
import AlterPassword from '../alterPassword';
import styles from './style.module.scss';

export default function AccountSetting() {
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const buildMainPart = () => {
        const mainPartArr = [
            <AccountBaseSetting title="基本设置" />,
            <AccountLawyerSetting title="律师信息设置" />,
            <AlterPassword title="修改密码" />
        ];

        return mainPartArr[activeIndex]
    }
    return (
        <div className={styles.layout}>
            <div className={styles.sidebar}>
                <h4 className={styles.title}>账号设置</h4>
                <div>
                    {
                        settingSideBarArr.map((sidebarItem, index) => {
                            return <div
                                key={index}
                                className={`${styles.sidebar_item_layout} ${activeIndex === index && styles.sidebar_item_layout_active}`}
                                onClick={() => setActiveIndex(index)}
                            >
                                <p >{sidebarItem.name}</p>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className={styles.main}>
                {buildMainPart()}
            </div>
        </div>
    )
}
