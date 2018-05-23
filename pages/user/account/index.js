const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageApi: {
      currentPage: 0,
      pageSize: 6,
      name: ''
    },
    list: [],
    hasMore: true,
    showModal: false,
    name: '',
    resetApi: {
      userId: '',
      password: ''
    }
  },
  getList() {
    let that = this;
    if (!that.data.hasMore) return;
    that.setData({
      'pageApi.currentPage': that.data.pageApi.currentPage + 1
    })
    app.api.subAccount(this.data.pageApi).then(res => {
      if (res.code === 1000) {
        res.data.list.forEach(el => {
          el.utime = app.utils.dateformat(el.updateTime);
          el.ctime = app.utils.dateformat(el.createTime);
        })

        if (res.data.list.length < that.data.pageApi.pageSize) {
          that.setData({
            'hasMore': false,
          })
        }
        that.setData({
          list: that.data.list.concat(res.data.list)
        })
      }
    })
  },
  resetBtn(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      showModal: true,
      name: item.name,
      'resetApi.userId': item.id
    })
  },
  close() {
    this.setData({
      showModal: false,
      name: '',
      'resetApi.password': ''
    })
  },
  psdHandle(e) {
    this.setData({
      'resetApi.password': e.detail.value
    })
  },
  savePassword() {
    if (this.data.resetApi.password != '') {
      if (this.data.resetApi.password.length < 6) {
        wx.showToast({
          title: '请输入不少于6位的新密码',
          icon: 'none'
        })
      } else {
        app.api.accountPassword(this.data.resetApi).then(res => {
          if (res.code === 1000) {
            wx.showToast({
              title: '修改成功',
              icon: 'none'
            })
            this.setData({
              showModal: false,
              'pageApi.currentPage': 0,
              'pageApi.name': '',
              'resetApi.password': '',
              list: [],
              hasMore: true
            })
            this.getList();
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
        title: '密码不能为空',
        icon: 'none'
      })
    }
  },
  nameHandle(e) {
    this.setData({
      'pageApi.name': e.detail.value
    })
  },
  //  删除子账号
  delAction(e) {
    let that = this;
    let data = e.currentTarget.dataset.item;
    wx.showModal({
      title: '删除提示',
      content: '账号删除后将无法恢复',
      success: function (res) {
        if (res.confirm) {
          app.api.DelsubAccount({ userId: data.id }).then(res => {
            if (res.code === 1000) {
              that.setData({
                'pageApi.currentPage': 0,
                'resetApi.password': '',
                list: [],
                hasMore: true
              })
              that.getList();
            } else {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
  goRoute(e) {
    let types = e.currentTarget.dataset.types;
    wx.navigateTo({
      url: 'sub/index?types=' + types,
    })
    if (types == 1) {
      let item = e.currentTarget.dataset.item
      wx.setStorageSync('cacheAccount', item)
    }
  },
  searchConfirm(e) {
    this.setData({
      'pageApi.currentPage': 0,
      'pageApi.name': e.detail.value,
      list: [],
      hasMore: true
    })
    this.getList();
  },
  quitSearch() {
    this.setData({
      'pageApi.currentPage': 0,
      'pageApi.name': '',
      list: [],
      hasMore: true
    })
    this.getList();
  },
  clearValue() {
    this.setData({
      'pageApi.name': '',
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList();
  },
})