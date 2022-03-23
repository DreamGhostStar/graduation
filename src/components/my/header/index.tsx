import { Image, message, Popover } from 'antd';
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { IStoreConfig, USER_DATA } from 'redux/action-types';
import styles from './style.module.scss';
import cookie from 'react-cookies';
import { httpSuccessCode, projectName, tokenKey } from 'consts';
import { useNavigate } from 'react-router';
import { getUserInfoApi } from 'api/user';
import AvatarTip from 'components/home/avatarTip';

export default function Header() {
  const user = useSelector((state: IStoreConfig) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getUserInfo = useCallback(async () => {
    const token = cookie.load(tokenKey);
    if (!token) {
      navigate('/login/register');
    }
    if (user) {
      return;
    }
    const { code, data, message: msg } = await getUserInfoApi({});
    if (code === httpSuccessCode) {
      dispatch({ type: USER_DATA, data });
    } else {
      message.error(msg);
    }
  }, [navigate, dispatch, user])
  const handleClickTitle = () => {
    navigate('/post')
  }
  useEffect(() => {
    getUserInfo();
  }, [getUserInfo])
  return (
    <div className={styles.layout}>
      <div className={styles.title} onClick={handleClickTitle}>{projectName}</div>
      <div className={styles.user_layout}>
        <Popover placement="bottom" content={<AvatarTip />}>
          <Image
            preview={false}
            src={user?.avatar}
            className={styles.avatar}
            width={40}
          />
        </Popover>
      </div>
    </div>
  )
}
