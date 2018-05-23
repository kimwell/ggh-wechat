const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataApi: {
      currentPage: 0,
      pageSize: 10,
      companyName: '',
      status: '',
      saleId: ''
    },
    bindSaleApi: {
      id: [],
      saleId: '',
      saleName: '',
      saleMobile: ''
    },
    list: [],
    filterNav: [{
      id: 0,
      name: '选择业务员'
    }, {
      id: 1,
      name: '选择分配状态'
    }],
    stautsNav: [{
      id: 1,
      name: '已分配'
    }, {
      id: 2,
      name: '未分配'
    }],
    filterStatus: '',
    filter: true,
    scrollHeight: 0,
    saleMan: [],
    saleManStatus: null,
    saleManShow: true,
    statusShow: true,
    allotStatus: null,
    checkArr: [],
    checkAll: false,
    selectLen: 0,
    coverClass: false,
    hasMore: true,
    finished: false
  },
  resetData() {
    let that = this;
    that.setData({
      'dataApi.currentPage': 0,
      'dataApi.pageSize': 10,
      'dataApi.companyName': '',
      'dataApi.status': '',
      'dataApi.saleId': '',
      'bindSaleApi.id': [],
      'bindSaleApi.saleId': '',
      'bindSaleApi.saleName': '',
      'bindSaleApi.saleMobile': '',
      list: [],
      filterStatus: '',
      checkArr: [],
      checkAll: false,
      selectLen: 0,
      coverClass: false,
      hasMore: true,
      finished: false
    })
  },
  getList() {
    let that = this;
    if (!that.data.hasMore) return;
    that.setData({
      'dataApi.currentPage': that.data.dataApi.currentPage + 1
    })
    app.api.findCustomer(that.data.dataApi).then(res => {
      if (res.code === 1000) {
        res.data.list.forEach(el => {
          el.isChecked = false;
          el.uTime = app.utils.dateformat(el.updateTime, 'yyyy-MM-dd');
        })
        if (res.data.list.length < that.data.dataApi.pageSize) {
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
  //  切换筛选状态
  switchFilter(e) {
    let idx = e.currentTarget.dataset.idx;
    if (!this.data.filter && idx === this.data.filterStatus) {
      this.setData({
        filter: true
      })
    } else {
      this.setData({
        filterStatus: idx,
        filter: false
      })
      if (idx === 0) {
        this.setData({
          statusShow: true,
          saleManShow: false
        })
      } else if (idx === 1) {
        this.setData({
          statusShow: false,
          saleManShow: true
        })
      }
    }
  },
  searchConfirm(e) {
    this.setData({
      'dataApi.companyName': e.detail.value,
      'dataApi.currentPage': 0,
      list: [],
      hasMore: true,
      finished: false
    })
    this.getList();
  },
  //  分配业务员
  allotAction() {
    let that = this;
    if (that.data.checkArr.length != 0 && that.data.bindSaleApi.saleName != '') {
      that.setData({
        'bindSaleApi.id': that.data.checkArr
      })
      let params = app.utils.copyData(that.data.bindSaleApi)
      params.id = JSON.stringify(params.id);
      params = JSON.parse(JSON.stringify(params));
      console.log(params)
      wx.showModal({
        title: '绑定业务员',
        content: '确定绑定业务员？',
        success: function (res) {
          if (res.confirm) {
            app.api.updateClientManagement(params).then(res => {
              if (res.code === 1000) {
                that.resetData();
                that.getList();
              }
            })
          }
        }
      })
    } else {
      if (that.data.checkArr.length == 0) {
        wx.showToast({
          title: '请选择客户公司',
          icon: 'none'
        })
      }
      if (that.data.bindSaleApi.saleName == '') {
        wx.showToast({
          title: '请选择业务员',
          icon: 'none'
        })
      }
    }
  },
  //  选择要分配的业务员
  selectMan(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      'bindSaleApi.saleId': item.saleId,
      'bindSaleApi.saleName': item.saleName,
      'bindSaleApi.saleMobile': item.saleMobile,
      coverClass: false
    })
  },
  // show 选择业务员
  showCover() {
    this.setData({
      coverClass: true
    })
  },
  closeCover() {
    this.setData({
      coverClass: false
    })
  },
  //  选择客户公司
  checkAllot(e) {
    let idx = e.currentTarget.dataset.idx;
    let item = e.currentTarget.dataset.item;
    this.setData({
      [`list[${idx}].isChecked`]: !this.data.list[idx].isChecked,
      checkArr: this.data.checkArr
    })
    if (this.data.list[idx].isChecked) {
      this.data.checkArr.push(item.id)
    } else {
      this.data.checkArr.forEach((el, index) => {
        if (el === item.id) {
          this.data.checkArr.splice(index, 1);
        }
      })
    }
    this.setData({
      checkArr: this.data.checkArr
    })
    this.totalLen();
    this.isCheckAll();
  },
  //  选择了几条？
  totalLen() {
    this.setData({
      selectLen: this.data.checkArr.length
    })
  },
  //  全选
  checkAlls() {
    if (this.data.checkAll) {
      this.data.list.forEach(el => {
        el.isChecked = false
      })
      this.setData({
        checkArr: [],
        checkAll: false,
        list: this.data.list
      })
    } else {
      this.data.checkArr = [];
      this.data.list.forEach(el => {
        el.isChecked = true;
        this.data.checkArr.push(el.id)
      })
      this.setData({
        checkArr: this.data.checkArr,
        checkAll: true,
        list: this.data.list
      })
    }
    this.totalLen();
  },
  //  是否全选
  isCheckAll() {
    if (this.data.checkArr.length === this.data.list.length) {
      this.setData({
        checkAll: true
      })
    } else {
      this.setData({
        checkAll: false
      })
    }
    if (this.data.checkArr.length === 0) {
      this.setData({
        checkAll: false
      })
    }
    this.totalLen();
  },
  // 选择分配状态
  switchAllot(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      allotStatus: item.id,
      'dataApi.status': item.id,
      [`filterNav[${1}].name`]: item.name
    })
  },
  //  选择专员
  selectSaleMan(e) {
    let idx = e.currentTarget.dataset.idx;
    let item = e.currentTarget.dataset.item;
    this.setData({
      saleManStatus: idx,
      'dataApi.saleId': item.saleId,
      [`filterNav[${0}].name`]: item.saleName
    })
  },
  //  获取业务员
  getSaleMan() {
    let user = wx.getStorageSync('user');
    app.api.findSalesmanByCompanyId({ companyId: user.companyId }).then(res => {
      if (res.code === 1000) {
        this.setData({
          saleMan: this.data.saleMan.concat(res.data)
        })
      }
    })
  },
  //  清空筛选
  clearFilter() {
    this.setData({
      'dataApi.status': '',
      'dataApi.saleId': '',
      saleManStatus: null,
      allotStatus: null,
      [`filterNav[${1}].name`]: '选择分配状态',
      [`filterNav[${0}].name`]: '选择业务员'
    })
  },
  //  查询筛选
  serarchFilter() {
    this.setData({
      filter: true,
      filterStatus: null,
      list: [],
      'dataApi.currentPage':0,
      hasMore: true,
      finished: false,
      checkArr: [],
      checkAll: false,
      selectLen: 0
    })
    this.getList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ role: app.role });
    let that = this;
    that.getList();
    that.getSaleMan();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 282
        })
      },
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList();
  }
})