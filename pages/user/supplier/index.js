const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageApi: {
      currentPage: 0,
      pageSize: 10,
      sellCompanyName: '',
      sellGetSort: '',
      firstGetTime: '',
      leastGetTime: '',
      orderGetSort: '',
      orderGetRate: '',
    },
    filterBar: [{
      id: 0,
      name: '报价成交量'
    }, {
      id: 1,
      name: '成交时间'
    }, {
      id: 2,
      name: '订单完成量'
    }],
    barStatus: '',
    filterFirst: {
      name: '首次成交时间',
      list: [{
        id: 0,
        name: '升序'
      }, {
        id: 1,
        name: '降序'
      }]
    },
    filterLast: {
      name: '最近成交时间',
      list: [{
        id: 0,
        name: '升序'
      }, {
        id: 1,
        name: '降序'
      }]
    },
    filterNum: {
      name: '订单完成量',
      list: [{
        id: 0,
        name: '升序'
      }, {
        id: 1,
        name: '降序'
      }]
    },
    filterRate: {
      name: '订单完成率',
      list: [{
        id: 0,
        name: '升序'
      }, {
        id: 1,
        name: '降序'
      }]
    },
    showMask: true,
    firstTime: '',
    lastTime: '',
    orderNum: '',
    orderRate: '',
    list: [],
    hasMore: true,
    finished: false,
    sellSort: 0
  },
  switchBar(e) {
    let that = this;
    let idx = e.currentTarget.dataset.idx;
    that.setData({
      barStatus: idx,
    })
    if (idx != 0) {
      that.setData({
        showMask: false
      })
    }
    if (idx === 0) {
      that.setData({
        showMask: true,
        'pageApi.currentPage': 0,
        list: [],
        hasMore: true,
        finished: false
      })
      if (that.data.sellSort === 1) {
        that.setData({
          sellSort: 0,
          'pageApi.sellGetSort': 0
        })
      } else {
        that.setData({
          sellSort: 1,
          'pageApi.sellGetSort': 1
        })
      }
      that.getList()
    }
  },
  closeMask() {
    this.setData({
      showMask: true,
      barStatus: ''
    })
  },
  //  首次成交时间切换排序
  switchFirstSort(e) {
    let idx = e.currentTarget.dataset.idx;
    let val = e.currentTarget.dataset.val
    if (this.data.barStatus == 1) {
      this.setData({
        firstTime: val,
        'pageApi.firstGetTime': val,
        'pageApi.currentPage': 0,
        list: [],
        hasMore: true,
        finished: false
      })
      this.getList();
    }
  },
  //  最近成交时间切换排序
  switchLastSort(e) {
    let idx = e.currentTarget.dataset.idx;
    let val = e.currentTarget.dataset.val
    if (this.data.barStatus == 1) {
      this.setData({
        lastTime: val,
        'pageApi.leastGetTime': val,
        'pageApi.currentPage': 0,
        list: [],
        hasMore: true,
        finished: false
      })
      this.getList();
    }
  },
  //  订单完成量切换排序
  switchNumSort(e) {
    let idx = e.currentTarget.dataset.idx;
    let val = e.currentTarget.dataset.val
    if (this.data.barStatus == 2) {
      this.setData({
        orderNum: val,
        'pageApi.currentPage': 0,
        'pageApi.orderGetSort': val,
        list: [],
        hasMore: true,
        finished: false
      })
      this.getList();
    }
  },
  //  订单完成率切换排序
  switchRateSort(e) {
    let idx = e.currentTarget.dataset.idx;
    let val = e.currentTarget.dataset.val
    if (this.data.barStatus == 2) {
      this.setData({
        orderRate: val,
        'pageApi.orderGetRate': val,
        'pageApi.currentPage': 0,
        list: [],
        hasMore: true,
        finished: false
      })
      this.getList();
    }
  },
  nameHandle(e) {
    this.setData({
      'pageApi.sellCompanyName': e.detail.value
    })
  },
  searchConfirm(e) {
    console.log(e)
    this.setData({
      'pageApi.currentPage': 0,
      'pageApi.sellCompanyName': e.detail.value,
      'pageApi.sellGetSort': '',
      'pageApi.firstGetTime': '',
      'pageApi.leastGetTime': '',
      'pageApi.orderGetSort': '',
      'pageApi.orderGetRate': '',
      list: [],
      hasMore: true,
      finished: false
    })
    this.getList();
  },
  getList() {
    let that = this;
    if (!this.data.hasMore) return;
    this.setData({
      'pageApi.currentPage': this.data.pageApi.currentPage + 1,
      hasMore: true,
    })
    app.api.supplerManager(this.data.pageApi).then(res => {
      if (res.code === 1000) {
        res.data.list.forEach(el => {
          el.firstTime = app.utils.dateformat(el.firstGetTime, 'yyyy-MM-dd hh:mm');
          el.newTime = app.utils.dateformat(el.newGetTime, 'yyyy-MM-dd hh:mm');
        })
        if (res.data.list.length < that.data.pageApi.pageSize) {
          that.setData({
            hasMore: false,
            finished: true
          })
        }
        that.setData({
          list: that.data.list.concat(res.data.list)
        })
      }
    })
  },
  makeCall(e) {
    let tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
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
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})