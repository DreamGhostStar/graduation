import { createFromIconfontCN } from '@ant-design/icons';
import cookie from 'react-cookies'

export const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_3222236_g404yl1b9zm.js'
});

export const getOverdueWithThreeDay = () => {
  const res = new Date(new Date().getTime() + 3 * 24 * 3600 * 1000);
  return res;
}

export const setUserTokenHeaders = () => {
  const token = cookie.load('Authorization');
  return {
    Authorization: token
  };
}