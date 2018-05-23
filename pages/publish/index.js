// pages/publish/index.js
Page({
  onShow: function () {
    wx.reLaunch({
      url: '/pages/publish/subPages/pbList/index',
    })
  }
})