const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modifyData: {
      oldPwd: '',
      newPwd: '',
      reNewPwd: ''
    }
  },
  oldHandle(e) {
    this.setData({
      'modifyData.oldPwd': e.detail.value
    })
  },
  newHandle(e) {
    this.setData({
      'modifyData.newPwd': e.detail.value
    })
  },
  renewHandle(e) {
    this.setData({
      'modifyData.reNewPwd': e.detail.value
    })
  },
  modifyBtn() {
    if (this.data.modifyData.oldPwd != '' && this.data.modifyData.newPwd != '' && this.data.modifyData.reNewPwd != '') {
      if (this.data.modifyData.newPwd != this.data.modifyData.reNewPwd) {
        wx.showToast({
          title: '两次新密码输入不一致',
          icon: 'none'
        })
      } else {
        app.api.updateBaseUsersSafeInfo(this.data.modifyData).then(res => {
          if (res.code === 1000) {
            wx.showModal({
              title: '修改密码',
              content: '密码修改成功,请重新登录',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.removeStorageSync('authorization');
                  wx.removeStorageSync('loginId');
                  wx.removeStorageSync('user');
                  wx.redirectTo({
                    url: '/pages/login/index',
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      }
    } else {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
    }
  },
  forgot() {
    wx.navigateTo({
      url: '/pages/login/forget/index',
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})