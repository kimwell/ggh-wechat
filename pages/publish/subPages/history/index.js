// pages/publish/subPages/history/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  getHistory() {
    app.api.ironHistory().then(res => {
      if (res.code === 1000) {
        let list = res.data.map(item => {
          item.time = app.utils.dateformat(item.createTime, 'yyyy-MM-dd');
          item.proPlacesName = app.utils.intercept(item.proPlacesName, 25);
          return item
        })
        this.setData({ list: list });
      }
    })
  },

  copy(e) {
    let i = e.currentTarget.dataset.i;
    let publishItems = wx.getStorageSync('publishItems') ? wx.getStorageSync('publishItems') : []
    if (publishItems.length < 6) {
      let item = this.data.list[i];
      delete item.createTime
      item.uuid = app.utils.getuuId();
      wx.setStorageSync('cacheIron', item);
      wx.navigateTo({ url: '/pages/publish/subPages/addNew/index?type=copy' });
    } else {
      wx.showModal({
        content: '单次最多发布6条',
      })
    }
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
    this.getHistory()
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