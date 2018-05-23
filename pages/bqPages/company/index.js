const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {}
  },
  getInfo(id) {
    app.api.findBuserInfoById({ companyId: id }).then(res => {
      if (res.code === 1000) {
        this.setData({
          item: res.data
        })
      }
    })
  },
  makeCall(e){
    let tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo(options.id)
  }
})