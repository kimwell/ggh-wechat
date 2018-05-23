// pages/orders/sellerOrder/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      label: '待确认',
      state: 0
    }, {
      label: '已成交',
      state: 1
    }, {
      label: '已取消',
      state: 2
    }, {
      label: '已作废',
      state: 3
    }, {
      label: '全部',
      state: ''
    }],
    apiUrl: '',
    activeSt: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.state)
      this.setData({
        activeSt: options.state
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 进入时候获取参数进行筛选
    this.selectComponent("#subPage").init();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 离开时候清理筛选参数
  },

  onPullDownRefresh() {
    this.selectComponent("#subPage").reflash();
  },
  onReachBottom() {
    this.selectComponent("#subPage").loadMore()
  }
})