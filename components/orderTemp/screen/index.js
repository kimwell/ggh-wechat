// components/orderTemp/screen/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyName: '',
    begin: '',
    end: '',
    today: '',
    status: [{
      label: '待确认',
      status: 0
    }, {
      label: '已完成',
      status: 1
    }, {
      label: '卖家取消',
      status: 3
    }, {
      label: '过期订单失效',
      status: 4
    }, {
      label: '买家取消',
      status: 5
    }, {
      label: '超管取消',
      status: 6
    }, {
      label: '超管作废',
      status: 7
    }],
    activeSt: null
  },

  benginChange: function (e) {
    this.setData({
      begin: e.detail.value
    })
  },

  endChange: function (e) {
    this.setData({
      end: e.detail.value
    })
  },

  init() {
    let nowTime = new Date().getTime() + 1;
    nowTime = app.utils.dateformat(nowTime, 'yy-MM-dd');
    // 获取筛选值
    let screen = wx.getStorageSync('orderScreen');
    if (screen) {
      this.setData({
        today: nowTime,
        companyName: screen.companyName || '',
        begin: screen.begin || '',
        end: screen.end || '',
        activeSt: screen.activeSt != undefined ? screen.activeSt : null
      });
    } else {
      this.setData({ today: nowTime });
    }
  },

  pick(e) {
    let i = e.currentTarget.dataset.i;
    this.setData({ activeSt: i })
  },

  updateValue(e) {
    this.setData({
      companyName: e.detail.value
    })
  },

  reset() {
    this.setData({
      companyName: '',
      begin: '',
      end: '',
      activeSt: null
    })
  },

  doScreen() {
    let screen = wx.getStorageSync('orderScreen') || {};
    screen.companyName = this.data.companyName;
    screen.begin = this.data.begin;
    screen.end = this.data.end;
    screen.activeSt = this.data.activeSt;
    // 如果选择状态筛选，就要去通过小状态同步大状态

    if (this.data.activeSt != null) {
      let sState = this.data.status[this.data.activeSt].status;
      if (sState == 3 || sState == 4) {
        screen.status = 2;
        screen.orderStatus = sState;
      } else if (sState == 5 || sState == 6 || sState == 7) {
        screen.status = 3;
        screen.orderStatus = sState;
      } else {
        screen.status = sState;
        screen.orderStatus = '';
      }
    } else {
      screen.orderStatus = '';
    }
    wx.setStorageSync('orderScreen', screen);
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init();
  }
})