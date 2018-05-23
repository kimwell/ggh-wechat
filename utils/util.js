/**
 * 格式化时间
 * @param  {Datetime} source 时间对象
 * @param  {String} format 格式
 * @return {String}        格式化过后的时间
 */

const df = require('./dateformat-npm.js');

export const dateformat = (value, fromatStr = 'yyyy-MM-dd hh:mm') => {
  return df.format(new Date(value), fromatStr)
}


// 浅拷贝
export const copyData = (value) => {
  return JSON.parse(JSON.stringify(value))
}

// 生成uuId
export const getuuId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

//多余部分省略号
export const intercept = (value, le = 30) => {
  return value.length <= le ? value : value.substring(0, le) + '...';
}

//组合产地
export const proStr = (list = []) => {
  let str = '';
  list.forEach(item => {
    str += item.name + ';'
  })
  return str
}

// js时间转化为几天前,几小时前，几分钟前
export const getDateDiff = (value, now) => {
  let nowTime = now ? now : new Date().getTime();
  let result = '';
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let halfamonth = day * 15;
  let month = day * 30;
  let diffValue = nowTime - value;
  if (diffValue < 0) { return '刚刚'; }
  let monthC = diffValue / month;
  let weekC = diffValue / (7 * day);
  let dayC = diffValue / day;
  let hourC = diffValue / hour;
  let minC = diffValue / minute;
  if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
}

import { clectionIds } from './api.js'
//发送id
export const fireIds = (list = [], app) => {
  console.log('当前openId:' + wx.getStorageSync('openId'))
  let openId = wx.getStorageSync('openId');
  if (list.length > 0 && wx.getStorageSync('authorization') && !!openId && openId != '') {
    let params = JSON.stringify(list);
    clectionIds({
      openId: openId,
      formIds: params
    }).then(res => {
      if (res.code == 1000) {
        app.formIds = []
      }
    })
  }
}

import { findCurrentUser } from './api.js'
//获取个人信息
export const getUserInfo = (app) => {
  if (wx.getStorageSync('role')) {
    app.role = wx.getStorageSync('role');
  }
  // if (JSON.stringify(app.userInfo) === '{}')
  findCurrentUser().then(res => {
    if (res.code === 1000) {
      app.buserInfo = res.data.buserInfo;
      delete res.data.buserInfo;
      app.userInfo = res.data;
      if (!app.buserInfo.isSellUser) {
        app.role = 'normal'
      } else if (app.buserInfo.isSellUser == '1') {
        if (app.userInfo.usrType == '1') {
          app.role = 'vip'
        } else if (app.userInfo.usrType == '3') {
          app.role = 'business'
        } else if (app.userInfo.usrType == '2,3' || app.userInfo.usrType == '3,2') {
          app.role = 'offer'
        }
      } else if (app.buserInfo.isSellUser == '0') {
        if (app.userInfo.usrType == '0') {
          app.role = 'normal'
        } else {
          app.role = 'admin'
        }
      }

      wx.setStorageSync('role', app.role);
      wx.setStorageSync('user', res.data)
      console.log(app.role)
    }
  })
}
