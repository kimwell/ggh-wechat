// components/orderTemp/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isBuyer: {
      type: Boolean,
      value: false
    },
    tabs: {
      type: Array,
      value: []
    },
    apiUrl: {
      type: String,
      value: ''
    },
    ac: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
        let statusKey = 'params.status';
        this.setData({
          active: newVal,
          [statusKey]: this.data.tabs[newVal].state
        });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    screenOn: false,
    cancelShow: false,
    active: 0,
    stateStrs: ['订单已完成', '待卖家确认', '卖家取消订单', '过期订单失效', '我方取消订单', '超管取消订单', '超管作废订单'],
    params: {
      sellCompanyName: '',
      buyCompanyName: '',
      currentPage: 1,
      pageSize: 10,
      status: 0,
      orderStatus: '',
      startTime: '',
      endTime: ''
    },
    list: [],
    totalCount: 0,
    saleManNum: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 切换tab
    switchTab(e) {
      let i = e.currentTarget.dataset.i;
      // let statusKey = 'params.status', os = 'params.orderStatus';
      this.setData({
        active: i,
        'params.status': this.data.tabs[i].state,
        'params.orderStatus': ''
      });
      this.getList();

      let screen = wx.getStorageSync('orderScreen') || {};
      if (screen.status != undefined && screen.status  != i) {
        screen = {
          status: i < 4 ? i : "",
          orderStatus: ''
        }
        this.setData({ screenOn: false})
        wx.setStorageSync('orderScreen', screen);
      }
    },
    // 获取列表
    getList() {
      let params = app.utils.copyData(this.data.params);
      app.api[this.data.apiUrl](params).then(res => {
        if (res.code === 1000) {
          let resList = res.data.list.map(item => {
            item.deliveryTime = app.utils.dateformat(item.deliveryTime, 'yyyy-MM-dd');
            item.level = ['', '50万', '100万', '500万'].findIndex(el => item.marginLevel == el);
            item.stateText = this.data.stateStrs[item.status - 1];
            return item
          });
          if (this.data.params.currentPage > 1) {
            resList = [...this.data.list, ...resList];
          }
          this.setData({
            list: resList,
            totalCount: res.data.totalCount,
            saleManNum: res.data.saleManNum || 0
          });
        } else {
          wx.showModal({
            title: res.message,
            showCancel: false
          })
        }
      })
    },
    // 进入筛选页面
    goScreen() {
      // 进入前保存下tab
      let activeTab = this.data.active;
      let screen = wx.getStorageSync('orderScreen') || {};
      screen.status = this.data.tabs[activeTab].state;
      screen.orderStatus = '';
      wx.setStorageSync('orderScreen', screen);
      wx.navigateTo({ url: '/components/orderTemp/screen/index' });
    },
    init() {
      let screen = wx.getStorageSync('orderScreen') || {
        status: this.data.ac,
        orderStatus: ""
      };
      wx.setStorageSync('orderScreen', screen);
      let bc = 'params.buyCompanyName', sc = 'params.sellCompanyName', st = 'params.status', ost = 'params.orderStatus', sd = 'params.startTime', ed = 'params.endTime';
      let activeTab = this.data.tabs.findIndex(tab => tab.state === screen.status);
      this.setData({
        [bc]: screen.companyName || '',
        [sc]: screen.companyName || '',
        [st]: screen.status == undefined ? this.data.ac : screen.status,
        [ost]: screen.orderStatus || '',
        [sd]: screen.begin != '' && screen.begin != null ? new Date(screen.begin).getTime() : '',
        [ed]: screen.end != '' && screen.end != null ? new Date(screen.end).getTime() : '',
        active: activeTab > -1 ? activeTab : this.data.active
      })
      this.getList();

      // 是否在筛选状态
      let isScreen = true;
      if (screen.activeSt != undefined) {
        isScreen = screen.activeSt != null || screen.begin != '' || screen.companyName != '' || screen.end != '' || screen.orderStatus != '';
      } else {
        isScreen = false
      }

      this.setData({
        screenOn: isScreen
      })
    },
    // 加载更多
    loadMore() {
      // 计算总页数
      let totlePage = Math.ceil(this.data.totalCount / this.data.params.pageSize);
      let nowPage = this.data.params.currentPage
      if (nowPage < totlePage) {
        this.setData({ 'params.currentPage': nowPage + 1 });
        this.getList();
      }
    },
    // 刷新
    reflash() {
      this.setData({ 'params.currentPage': 1 });
      this.getList();
      wx.stopPullDownRefresh();
    },

    //跳转详情
    goDetail(e) {
      let item = e.currentTarget.dataset.item;
      // wx.removeStorageSync('orderDetail');
      // wx.setStorageSync('orderDetail', item);
      wx.navigateTo({
        url: '/components/orderTemp/orderDetail/index?isBuyer=' + this.data.isBuyer + '&storeOrderId=' + item.storeOrderId
      })
    },
    // 再次购买
    buyAgan(e) {
      let data = e.currentTarget.dataset.obj;
      let publishItems = wx.getStorageSync('publishItems') ? wx.getStorageSync('publishItems') : []
      if (publishItems.length < 6) {
        delete data.id
        delete data.ironSell
        delete data.sellNum
        delete data.isShow
        delete data.baseUnit
        delete data.offerPerPrice
        delete data.buyStatus
        delete data.cancelRemark
        delete data.confirmTime
        delete data.marginLevel
        delete data.sellRemark
        delete data.buyRemark
        delete data.cancelRemark
        data.uuid = app.utils.getuuId();
        wx.setStorageSync('cacheIron', data);
        wx.navigateTo({ url: '/pages/publish/subPages/addNew/index?type=copy' });
      } else {
        wx.showModal({
          content: '单次最多发布6条',
        })
      }
    },
    //绑定，换帮业务员
    bindSales(e) {
      let item = e.currentTarget ? e.currentTarget.dataset.item : e;
      let params = 'saleId=' + item.saleId + '&storeOrderId=' + item.storeOrderId + '&buyCompny=' + item.sellCompanyName + '&saleMan=' + item.saleName + '&saleMobile=' + item.saleMobile;
      wx.navigateTo({
        url: '/components/orderTemp/Salesman/index?' + params
      })
    },
    // 修改订单
    editOrder(e) {
      let item = this.data.list[e.currentTarget.dataset.i];
      let _this = this;
      if (item.saleId == "") {
        wx.showModal({
          title: '是否前往绑定？',
          content: '还未给该买家分配业务员， 分配业务员后方可操作订单。',
          success: function (res) {
            if (res.confirm) {
              _this.bindSales(item)
            }
          }
        })
      } else {
        let units = JSON.stringify([{ id: item.weightUnitId, name: item.weightUnit }, { id: item.numberUnitId, name: item.numberUnit }]);
        let params = 'ironBuyId=' + item.storeOrderId + '&offerPerPrice=' + item.price + '&tolerance=' + item.saleTolerance + '&offerPlacesId=' + item.saleProPlaceId + '&offerPlaces=' + item.saleProPlaceName + '&baseUnitId=' + item.saleBaseUnitId + '&baseUnit=' + item.saleBaseUnit + '&offerRemark=' + item.sellRemark + '&delivery=' + item.deliveryTime + '&units=' + units + '&ironType=' + item.ironTypeName;
        wx.navigateTo({
          url: '/components/orderTemp/modifyPrice/index?' + params
        })
      }
    },

    //取消订单
    cancelOrder(e) {
      let activeItem = this.data.list[e.currentTarget.dataset.i];
      let _this = this;
      if (this.data.isBuyer) {
        this.setData({ cancelShow: true, activeItem: e.currentTarget.dataset.i });
      } else {
        if (activeItem.saleId == "") {
          wx.showModal({
            title: '是否前往绑定？',
            content: '还未给该买家分配业务员， 分配业务员后方可操作订单。',
            success: function (res) {
              if (res.confirm) {
                _this.bindSales(activeItem)
              }
            }
          })
        } else {
          this.setData({ cancelShow: true, activeItem: e.currentTarget.dataset.i });
        }
      }
    },
    cancelHide(e) {
      this.setData({ cancelShow: e.detail });
    },
    // 确定取消订单
    cancelPick(e) {
      app.api.cancelOrder({
        id: this.data.list[this.data.activeItem].storeOrderId,
        remark: e.detail
      }).then(res => {
        if (res.code === 1000) {
          this.init();
        } else {
          wx.showToast({
            title: res.message
          })
        }
      })

    },

    // 卖家确认订单
    sellConf(e) {
      let activeItem = this.data.list[e.currentTarget.dataset.i];
      let _this = this;
      if (activeItem.saleId == "") {
        wx.showModal({
          title: '是否前往绑定？',
          content: '还未给该买家分配业务员， 分配业务员后方可操作订单。',
          success: function (res) {
            if (res.confirm) {
              _this.bindSales(activeItem)
            }
          }
        })
      } else {
        wx.showModal({
          title: '是否确认？',
          content: '确定后将无法撤销，是否继续？',
          success: function (res) {
            if (res.confirm) {
              app.api.confirmStore({
                id: activeItem.storeOrderId
              }).then(res => {
                if (res.code === 1000) {
                  wx.showToast({
                    title: '定单确认成功！'
                  });
                  _this.init();
                } else {
                  wx.showToast({
                    title: res.message
                  })
                }
              })
            }
          }
        })
      }

    },
    // 批量分配
    fpSome() {
      wx.navigateTo({
        url: '/components/orderTemp/salesmanSome/index',
      })
    },

    // 作废
    toVoid() {
      wx.showModal({
        title: '已完成的订单，需联系客服作废，谢谢配合',
        content: '工作时间：8:30-17:30(周一到周五)',
        confirmText: '联系客服',
        confirmColor: '#0076FF',
        success: function (res) {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: '0510-88230975' //仅为示例，并非真实的电话号码
            })
          }
        }
      })
    }
  },
  ready() {
    this.setData({
      role: app.role
    })
  }
})
