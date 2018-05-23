// pages/index/shops/index.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      label: '500W',
      groupId: '3559'
    }, {
      label: '100W',
      groupId: '3569'
    }, {
      label: '50W',
      groupId: '3580'
    }],
    active: 0,
    list:[],
    defaultImg: ''
  },

  switchTab(e) {
    let i = e.currentTarget.dataset.i;
    this.setData({ active: i });
    this.getShoplist();
  },
  getShoplist() {
    let groupId = this.data.tabs[this.data.active].groupId;
    if(groupId == '') return
    app.api.getSHopAd({ groupId: groupId }).then(res => {
      if (res.code === 1000) {
        let data = res.data.data.adList;
        this.setData({
          list: data,
          defaultImg: res.data.data.defaultImg
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getShoplist();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }
})