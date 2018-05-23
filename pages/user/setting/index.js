// pages/user/setting/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuData: [{
      id: 0,
      name: '基本信息',
      router: 'parts/info/index'
    }, {
      id: 1,
      name: '账号安全',
      router: 'parts/safe/index'
    }]
  },
  goRouter(e) {
    let router = e.currentTarget.dataset.router;
    wx.navigateTo({
      url: router,
    })
  },
  // 退出登录
  loginOut() {
    app.api.cleanFormId({
      openId: wx.getStorageSync('openId')
    });

    wx.removeStorageSync('authorization');
    wx.removeStorageSync('loginId');
    wx.removeStorageSync('user');
    wx.removeStorageSync('role')
    app.userInfo = {};
    app.baseInfo = {};
    wx.removeStorageSync('openId');
    wx.redirectTo({
      url: '/pages/login/index',
    })
  },
})