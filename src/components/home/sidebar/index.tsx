import React from 'react';
import { Image, Popover } from 'antd';
import styles from './style.module.scss';
import { ISideBarItem, sideBarArr } from 'consts';
import { MyIcon } from 'utils';
import { useSelector } from 'react-redux';
import { IUserConfig } from 'redux/action-types';
import { LoadingOutlined } from '@ant-design/icons';
import AvatarTip from '../avatarTip';
import { useNavigate, useParams } from 'react-router';
import { IHomeParams } from 'pages/home';
import classNames from 'classnames';

interface IUser {
  user: IUserConfig;
}

interface ISideBarProps {
  clear: () => void;
}

export default function SideBar({ clear }: ISideBarProps) {
  const user = useSelector((state: IUser) => state.user);
  const navigate = useNavigate();
  const params = useParams<IHomeParams>();
  const handleClickSideBarItem = (item: ISideBarItem) => {
    navigate(`/${item.type}`);
    clear();
  }

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        {
          user && user.avatar
            ? <Popover
              className={styles.tip_layout}
              placement="right"
              content={<AvatarTip />}
              trigger="hover"
            >
              <Image
                preview={false}
                className={styles.logo}
                width={40}
                src={user?.avatar}
              />
            </Popover>
            : <div className={styles.avatar_loading_layout}>
              <LoadingOutlined className={styles.avatar_loading} />
            </div>
        }
        {
          sideBarArr.map((sideBarItem, index) => {
            return <div
              onClick={() => handleClickSideBarItem(sideBarItem)}
              key={index}
              className={classNames(styles.side_bar_item, {
                [styles.side_bar_item_active]: params.type === sideBarItem.type
              })}
            >
              <MyIcon type={sideBarItem.icon} className={styles.icon} />
              <p className={styles.icon_text}>{sideBarItem.name}</p>
            </div>
          })
        }
      </div>
    </div>
  )
}
