const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false,
    apiData: {
      userId: '',
      usrType: '3',
      mobile: '',
      name: '',
      password: '',
      qq: '',
      remark: ''
    },
    companyName: '',
    accountInfo: {},
    userType: [{
      name: '商家业务员',
      value: 3,
      checked: true,
      disable: true
    }, {
      name: '商家报价员',
      value: 2,
      checked: false,
      disable: false
    }],
    checkArr: []
  },
  removeCache() {
    wx.removeStorageSync('cacheAccount')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user = wx.getStorageSync('user');
    this.setData({
      companyName: user.companyName
    })
    if (options.types == 1) {
      this.setData({
        isEdit: true
      })
      let cache = wx.getStorageSync('cacheAccount');
      this.setData({
        accountInfo: cache,
        companyName: user.companyName
      })
      this.setData({
        'apiData.mobile': this.data.accountInfo.mobile,
        'apiData.name': this.data.accountInfo.name,
        'apiData.qq': this.data.accountInfo.qq,
        'apiData.remark': this.data.accountInfo.remark,
        'apiData.usrType': this.data.accountInfo.usrType,
        'apiData.userId': this.data.accountInfo.id,
        checkArr: this.data.accountInfo.usrType.split(',')
      })
      this.data.userType.forEach((el, index) => {
        this.data.checkArr.forEach(sub => {
          if (el.value == sub) {
            this.setData({
              [`userType[${index}].checked`]: true
            })
          }
        })
      })
    }
  },
  checkboxChange(e) {
    this.setData({
      'apiData.usrType': e.detail.value.join(',')
    })
  },
  areaHandle(e) {
    this.setData({
      'apiData.remark': e.detail.value
    })
  },
  qqHandle(e) {
    this.setData({
      'apiData.qq': e.detail.value
    })
  },
  pswdHandle(e) {
    this.setData({
      'apiData.password': e.detail.value
    })
  },
  telHandle(e) {
    this.setData({
      'apiData.mobile': e.detail.value
    })
  },
  nameHandle(e) {
    this.setData({
      'apiData.name': e.detail.value
    })
  },
  goQuit() {
    wx.navigateBack({
      delta: 1
    })
  },
  changeprePage() {
    prePage.setData({
      hasMore: true,
      list: [],
      'pageApi.currentPage': 0
    })
  },
  goSure() {
    let pages = getCurrentPages();
    let apiUrl = this.data.isEdit ? app.api.updateAccount : app.api.saveAccount
    if (this.data.apiData.name != '' && this.data.apiData.mobile != '') {
      if (!this.data.isEdit) {
        delete this.data.apiData.userId
      }
      apiUrl(this.data.apiData).then(res => {
        if (res.code === 1000) {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
          //  返回上一页，并刷新
          if (pages.length > 1) {
            var prePage = pages[pages.length - 2];
            wx.navigateBack({
              delta: 1,
            })
            prePage.setData({
              hasMore: true,
              list: [],
              'pageApi.currentPage': 0
            })
            prePage.getList();
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    }else{
      wx.showToast({
        title: '请输入完整信息',
        icon: 'none'
      })
    }
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
    // 设置导航文字    
    wx.setNavigationBarTitle({
      title: this.data.isEdit ? '编辑子账号' : '新建子账号'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.removeCache();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.removeCache();
  }
})