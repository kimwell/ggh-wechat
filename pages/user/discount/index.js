const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotList: [],
    tag: '',
    fontLen: 0,
    info: {}
  },
  getAll() {
    app.api.findAllPro().then(res => {
      if (res.code === 1000) {
        this.setData({
          hotList: res.data
        })
      }
    });
  },
  tagHandle(ev) {
    var index = ev.currentTarget.dataset.id;
    var len = this.data.hotList[index].info.length
    this.setData({
      tag: this.data.hotList[index].info,
      fontLen: len
    })
  },
  bindArea(e) {
    var len = parseInt(e.detail.value.length)
    this.setData({
      tag: e.detail.value,
      fontLen: len
    })
  },
  areaBlur(e) {
    let area = e.detail.value
    this.setData({
      tag: this.data.tag
    })
  },
  pbBtn() {
    if (this.data.tag != '') {
      app.api.saveProInfo({ proInfo: this.data.tag }).then(res => {
        if (res.code === 1000) {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    } else {
      wx.showToast({
        title: '请填写优惠信息',
        icon: 'none'
      })
    }
  },
  getCurrent() {
    app.api.findCurrentUser().then(res => {
      if (res.code === 1000) {
        this.setData({
          tag: res.data.buserInfo.proInfo,
          fontLen: res.data.buserInfo.proInfo.length
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAll();
    this.getCurrent();
  }
})