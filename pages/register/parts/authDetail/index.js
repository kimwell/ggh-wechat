// pages/register/parts/authDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pass:'',
    data:{}
  },
  reCommit(){
    let pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.reCommit();
      wx.navigateBack({
        delta: 1
      })
      this.clearSync();
    }
  },
  clearSync(){
    wx.removeStorageSync('data')
    wx.removeStorageSync('pass')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pass: wx.getStorageSync('pass'),
      data: wx.getStorageSync('data')
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.clearSync()
  }
})