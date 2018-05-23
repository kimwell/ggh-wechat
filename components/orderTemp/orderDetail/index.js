// components/orderTemp/orderDetail/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBuyer: true,
    cancelShow: false,
    stateStrs: ['订单已完成', '待卖家确认', '卖家取消订单', '过期订单失效', '我方取消订单', '超管取消订单', '超管作废订单'],
    item: {}
  },
  cancelOrder() {
    let _this = this;
    if (this.data.item.saleId == "") {
      wx.showModal({
        title: '是否前往绑定？',
        content: '还未给该买家分配业务员， 分配业务员后方可操作订单。',
        success: function (res) {
          if (res.confirm) {
            _this.bindSales(_this.data.item)
          }
        }
      })
    } else {
      this.setData({ cancelShow: true });
    }
  },

  cancelHide(e) {
    this.setData({ cancelShow: e.detail });
  },
  // 确定取消订单
  cancelPick(e) {
    app.api.cancelOrder({
      id: this.data.item.storeOrderId,
      remark: e.detail
    }).then(res => {
      if (res.code === 1000) {
        wx.navigateBack();
      } else {
        wx.showToast({ title: res.message });
      }
    })
  },

  // 再次购买
  buyAgan() {
    let data = app.utils.copyData(this.data.item);
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

  // 打电话
  makeCall() {
    wx.makePhoneCall({ phoneNumber: this.data.item.contactNum })
  },
  //复制订单号
  copyOrderId() {
    wx.setClipboardData({
      data: this.data.item.storeOrderId
    })
  },

  // 卖家确认订单
  sellConf(e) {
    let _this = this;
    if (this.data.item.saleId == "") {
      wx.showModal({
        title: '是否前往绑定？',
        content: '还未给该买家分配业务员， 分配业务员后方可操作订单。',
        success: function (res) {
          if (res.confirm) {
            _this.bindSales(_this.data.item)
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
              id: _this.data.item.storeOrderId
            }).then(res => {
              if (res.code === 1000) {
                wx.showToast({
                  title: '定单确认成功！'
                });
                wx.navigateBack();
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

  //绑定，换帮业务员
  bindSales(e) {
    let item = this.data.item;
    let params = 'saleId=' + item.saleId + '&storeOrderId=' + item.storeOrderId + '&buyCompny=' + item.sellCompanyName + '&saleMan=' + item.saleName + '&saleMobile=' + item.saleMobile;
    wx.navigateTo({
      url: '/components/orderTemp/Salesman/index?' + params
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
  },

  // 修改订单
  editOrder(e) {
    let _this = this;
    if (this.data.item.saleId == "") {
      wx.showModal({
        title: '是否前往绑定？',
        content: '还未给该买家分配业务员， 分配业务员后方可操作订单。',
        success: function (res) {
          if (res.confirm) {
            _this.bindSales(_this.data.item)
          }
        }
      })
    } else {
      let item = this.data.item;
      let units = JSON.stringify([{ id: item.weightUnitId, name: item.weightUnit }, { id: item.numberUnitId, name: item.numberUnit }]);
      let params = 'ironBuyId=' + item.storeOrderId + '&offerPerPrice=' + item.price + '&tolerance=' + item.saleTolerance + '&offerPlacesId=' + item.saleProPlaceId + '&offerPlaces=' + item.saleProPlaceName + '&baseUnitId=' + item.saleBaseUnitId + '&baseUnit=' + item.saleBaseUnit + '&offerRemark=' + item.sellRemark + '&delivery=' + item.deliveryTime + '&units=' + units + '&ironType=' + item.ironTypeName;
      wx.navigateTo({
        url: '/components/orderTemp/modifyPrice/index?' + params
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isBuyer: options.isBuyer == 'true',
      storeOrderId: options.storeOrderId
    })
  
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let item = wx.getStorageSync('orderDetail');
    app.api.findOrder({
      storeOrderId: this.data.storeOrderId
    }).then(res => {
      if(res.code === 1000){
        let item = res.data;
        item.zhongbiao = app.utils.dateformat(item.createTime);
        item.statusStr = this.data.stateStrs[item.status - 1];
        item.deliveryTime = app.utils.dateformat(item.deliveryTime, 'yyyy-MM-dd');
        item.level = ['', '50万', '100万', '500万'].findIndex(el => item.marginLevel == el);
        this.setData({
          item: item
        })
      }
    })

    
  }
})