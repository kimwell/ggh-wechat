const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userNav: [{
      id: 0,
      name: '买家中心'
    }, {
      id: 1,
      name: '卖家中心'
    }],
    navStatus: 0,
    orderNav: [{
      state: 0,
      name: '待确认',
      icon: '/static/images/order-nav1.png',
      count: 0
    }, {
      state: 1,
      name: '已完成',
      icon: '/static/images/order-nav2.png',
      count: 0
    }, {
      state: 2,
      name: '已取消',
      icon: '/static/images/order-nav3.png',
      count: 0
    }, {
      state: 3,
      name: '已作废',
      icon: '/static/images/order-nav4.png',
      count: 0
    }],
    businessNav: [{
      state: 0,
      name: '子账号',
      icon: '/static/images/business-nav1.png',
      route: 'account/index'
    }, {
      id: 1,
      name: '客户管理',
      icon: '/static/images/business-nav2.png',
      route: 'customer/index'
    }, {
      id: 2,
      name: '发布优惠',
      icon: '/static/images/business-nav3.png',
      route: 'discount/index'
    }, {
      id: 3,
      name: '经营范围',
      icon: '/static/images/business-nav4.png',
      route: 'scope/index'
    }],
    info: {},
    role: ''
  },
  switchNav(e) {
    let idx = e.currentTarget.dataset.idx;
    this.setData({ navStatus: idx });
    this.getOrderCount();
  },

  // 获取订单数据
  getOrderNum(){
    app.api.getBuyerOrder({ currentPage: 1, pageSize: 0})
  },
  goRoute(e) {
    let route = e.currentTarget.dataset.route;
    wx.navigateTo({
      url: route,
    })
  },
  goData(e) {
    let id = e.currentTarget.dataset.company;
    wx.navigateTo({
      url: 'dataAnalysis/index?id=' + id,
    })
  },
  goSupplier() {
    wx.navigateTo({
      url: 'supplier/index',
    })
  },
  goSetting() {
    wx.navigateTo({
      url: 'setting/index',
    })
  },
  goUnion(){
    wx.navigateTo({
      url: 'union/index',
    })
  },
  //  获取当前用户信息
  currentUser() {
    app.api.findCurrentUser().then(res => {
      if (res.code === 1000) {
        this.setData({ info: res.data })
      }
    })
  },

  makeCall(e) {
    let tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },

  routeToOrder(e) {
    let state = e.currentTarget.dataset.item.state;
    //0为买家1为卖家
    let bs = this.data.navStatus == 0 ? 'buyerOrder' : 'sellerOrder';
    let url = '/pages/orders/' + bs + '/index?state=' + state;
    wx.navigateTo({ url: url });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = app.utils.copyData(app.userInfo);
    userInfo.buserInfo = app.utils.copyData(app.buserInfo);
    this.setData({ info: userInfo, role: app.role });
    // 根据权限显示菜单
    if (app.role == 'admin') {
      this.setData({
        userNav: [{ id: 0, name: '买家中心' }],
      })
    } else if (app.role == 'offer') {
      this.setData({
        userNav: [],
        navStatus: 1,
        businessNav: [{
          id: 1,
          name: '客户管理',
          icon: '../../static/images/business-nav2.png',
          route: 'customer/index'
        }]
      })
    } else if (app.role == 'business') {
      this.setData({
        userNav: [],
        navStatus: 1,
        businessNav: [{
          id: 1,
          name: '客户管理',
          icon: '../../static/images/business-nav2.png',
          route: 'customer/index'
        }]
      })
    } else if (app.role == 'normal') {
      this.setData({
        userNav: [],
        businessNav: []
      })
    }
  },
  // 获取订单数量
  getOrderCount(){
    let orderApi = this.data.navStatus == 0 ? 'getBuyerOrder' : 'getSellerOrder';
    app.api[orderApi]({
      sellCompanyName: '',
      currentPage: 1,
      pageSize: 0,
      status: '',
      orderStatus: '',
      startTime: '',
      endTime: ''
    }).then(res => {
      if(res.code === 1000){
        this.setData({
          'orderNav[0].count': res.data.dqr,
          'orderNav[1].count': res.data.wc,
          'orderNav[2].count': res.data.wqr,
          'orderNav[3].count': res.data.zf,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrderCount();
    //清除筛选参数
    wx.removeStorageSync('orderScreen');
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    this.getOrderCount();
  }
})