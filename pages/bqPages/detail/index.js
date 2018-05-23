const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objData: {},
    types: 1,
    list: [],
    maskShow: false,
    oList: [],
    deliveryTime: '',
    today: '',
    offerApi: {
      ironBuyId: '',
      offerPerPrice: '',
      tolerance: '',
      offerPlacesId: '',
      baseUnitId: '',
      baseUnit: '',
      offerPlaces: '',
      offerRemark: '',
      delivery: ''
    },
    textareaHide: true,
    unit: [],
    unitData: '吨',
    unitIndex: 0,
    isEdit: false,
    ironSell: {
      ironBuyId: '',
      ironSellId: ''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let today = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    wx.setStorageSync('from_detail', false)
    let obj = wx.getStorageSync('obj')
    let types = options.types;
    let that = this;
    this.setData({
      objData: obj,
      types: types,
      today: app.utils.dateformat(today, 'yyyy-MM-dd'),
      isEdit: options.isEdit == 1 ? true : false,
      'ironSell.ironBuyId': obj.id
    })
    this.getDetails();
    if (this.data.types == 2 && this.data.objData.offerStatus == 0) {
      this.setData({
        'offerApi.ironBuyId': this.data.objData.id
      })
    }
    this.setUnit();
    //  编辑赋值
    if (this.data.isEdit) {
      this.setData({
        'offerApi.ironBuyId': this.data.objData.ironSell[0].ironBuyId,
        'offerApi.offerPerPrice': this.data.objData.ironSell[0].offerPerPrice,
        'offerApi.tolerance': this.data.objData.ironSell[0].tolerance,
        'offerApi.offerPlaces': this.data.objData.ironSell[0].offerPlaces,
        'offerApi.offerPlacesId': this.data.objData.ironSell[0].offerPlacesId,
        'offerApi.baseUnitId': this.data.objData.ironSell[0].baseUnitId,
        'offerApi.baseUnit': this.data.objData.ironSell[0].baseUnit,
        'offerApi.offerRemark': this.data.objData.ironSell[0].offerRemark,
        'offerApi.delivery': this.data.objData.ironSell[0].deliveryTime,
        deliveryTime: app.utils.dateformat(this.data.objData.ironSell[0].deliveryTime, 'yyyy-MM-dd'),
        unitData: this.data.objData.ironSell[0].baseUnit
      })
    }
  },
  //  中标
  bidBtn(e) {
    let that = this;
    this.setData({
      'ironSell.ironSellId': e.currentTarget.dataset.item.sellId
    })
    wx.showModal({
      title: '选他中标',
      content: '确认选择此报价中标？',
      success: function (res) {
        if (res.confirm) {
          app.api.getIronSell(that.data.ironSell).then(res => {
            if (res.code === 1000) {
              wx.reLaunch({ url: '/pages/buyer/index?types=refresh' })
              wx.setStorageSync('from_detail', false)
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
  setUnit() {
    if (this.data.objData.numberUnit != "" && this.data.objData.weightUnit != "") {
      this.setData({
        [`unit[${0}].unit`]: this.data.objData.numberUnit,
        [`unit[${0}].unitId`]: this.data.objData.numberUnitId,
        [`unit[${1}].unit`]: this.data.objData.weightUnit,
        [`unit[${1}].unitId`]: this.data.objData.weightUnitId,
        'offerApi.baseUnitId': this.data.objData.weightUnitId,
        'offerApi.baseUnit': this.data.objData.weightUnit,
        unitIndex: 1
      })
    }
    if (this.data.objData.weightUnit != "" && this.data.objData.numberUnit == "") {
      this.setData({
        [`unit[${0}].unit`]: this.data.objData.weightUnit,
        [`unit[${0}].unitId`]: this.data.objData.weightUnitId,
      })
    }
    if (this.data.objData.weightUnit == "" && this.data.objData.numberUnit != "") {
      this.setData({
        [`unit[${0}].unit`]: this.data.objData.numberUnit,
        [`unit[${0}].unitId`]: this.data.objData.numberUnitId,
      })
    }
  },
  bindPickerChange(e) {
    this.setData({
      unitIndex: Number(e.detail.value)
    })
    this.setData({
      unitData: this.data.unit[this.data.unitIndex].unit,
      'offerApi.baseUnit': this.data.unit[this.data.unitIndex].unit,
      'offerApi.baseUnitId': this.data.unit[this.data.unitIndex].unitId
    })
  },
  getDetails() {
    let that = this;
    app.api.queryIronSell({ ironBuyId: this.data.objData.id }).then(res => {
      if (res.code === 1000) {
        res.data.forEach(el => {
          el.time = app.utils.dateformat(el.updateTime);
          el.ctime = app.utils.dateformat(el.createTime);
          el.dtime = app.utils.dateformat(el.deliveryTime, 'yyyy-MM-dd');
        })
        that.setData({
          list: that.data.list.concat(res.data)
        })
        let oData = res.data.slice(1)
        that.setData({
          oList: that.data.oList.concat(oData)
        })
      }
    })
  },
  removeSysObj() {
    wx.removeStorageSync('obj')
  },
  showOption() {
    this.setData({
      maskShow: true,
      'objData.isShow': true
    })
  },
  tapMask() {
    this.setData({
      maskShow: false,
      'objData.isShow': false
    })
  },
  //  复制
  tapCopy(e) {
    let data = e.currentTarget.dataset.obj;
    let id = e.currentTarget.dataset.idx;
    let publishItems = wx.getStorageSync('publishItems') ? wx.getStorageSync('publishItems') : []
    if (publishItems.length < 6) {
      delete data.id
      delete data.ironSell
      delete data.sellNum
      delete data.isShow
      delete data.baseUnit
      delete data.offerPerPrice
      delete data.buyStatus
      data.uuid = app.utils.getuuId();
      wx.setStorageSync('cacheIron', data);
      wx.navigateTo({ url: '/pages/publish/subPages/addNew/index?type=copy' });
    } else {
      wx.showModal({
        content: '单次最多发布6条',
      })
    }
  },
  //  编辑
  tapEdit(e) {
    let data = e.currentTarget.dataset.obj;
    let id = e.currentTarget.dataset.idx;
    delete data.ironSell
    delete data.sellNum
    delete data.isShow
    delete data.baseUnit
    delete data.offerPerPrice
    data.uuid = app.utils.getuuId();
    wx.setStorageSync('cacheIron', data);
    wx.navigateTo({ url: '/pages/publish/subPages/addNew/index?type=edit' });
  },
  //  删除
  tapDel(e) {
    let that = this;
    let obj = e.currentTarget.dataset.obj;
    let idx = e.currentTarget.dataset.idx;
    wx.showModal({
      title: '删除提示',
      content: '确认删除此条求购？删除后将无法恢复。',
      success: function (res) {
        if (res.confirm) {
          that.deleteIronBuy(obj.id)
        }
      }
    })
  },
  deleteIronBuy(id) {
    app.api.deleteIronBuy({ ironBuyId: id }).then(res => {
      if (res.code == 1000) {
        wx.reLaunch({ url: '/pages/buyer/index?types=refresh' })
        wx.setStorageSync('from_detail', false)
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },
  // 呼叫
  callTap(e) {
    let tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  //  年月日转毫秒时间戳
  tranData(val) {
    var date = val;
    date = date.replace(/-/g, '/');
    var time = new Date(date).getTime();
    return time
  },
  //  产地
  proPlacesOnpick(e) {
    this.setData({
      'offerApi.offerPlacesId': e.detail.id,
      'offerApi.offerPlaces': e.detail.name
    })
  },
  // 交货日期
  changeDate(e) {
    this.setData({
      deliveryTime: e.detail.value,
      'offerApi.delivery': this.tranData(e.detail.value),
    })
  },
  //  输入单价
  priceHandle(e) {
    this.setData({
      'offerApi.offerPerPrice': e.detail.value
    })
  },
  //  输入公差
  toleranceHandle(e) {
    this.setData({
      'offerApi.tolerance': e.detail.value
    })
  },
  //  输入备注
  markHandle(e) {
    this.setData({
      'offerApi.offerRemark': e.detail.value
    })
  },
  //  查看商户详情
  goCompany(e) {
    let id = e.currentTarget.dataset.user;
    wx.navigateTo({
      url: '/pages/bqPages/company/index?id=' + id
    })
  },
  //  查看历史报价
  historyBtn(e) {
    let id = e.currentTarget.dataset.iron;
    let item = e.currentTarget.dataset.item;
    wx.setStorageSync('offerData', item.ironSell)
    wx.navigateTo({
      url: '/pages/bqPages/history/index?id=' + id,
    })
  },
  modifyIsedit() {
    this.setData({
      isEdit: true,
      'offerApi.ironBuyId': this.data.objData.ironSell[0].ironBuyId,
      'offerApi.offerPerPrice': this.data.objData.ironSell[0].offerPerPrice,
      'offerApi.tolerance': this.data.objData.ironSell[0].tolerance,
      'offerApi.offerPlaces': this.data.objData.ironSell[0].offerPlaces,
      'offerApi.offerPlacesId': this.data.objData.ironSell[0].offerPlacesId,
      'offerApi.baseUnitId': this.data.objData.ironSell[0].baseUnitId,
      'offerApi.baseUnit': this.data.objData.ironSell[0].baseUnit,
      'offerApi.offerRemark': this.data.objData.ironSell[0].offerRemark,
      'offerApi.delivery': this.data.objData.ironSell[0].deliveryTime,
      deliveryTime: app.utils.dateformat(this.data.objData.ironSell[0].deliveryTime, 'yyyy-MM-dd'),
      unitData: this.data.objData.ironSell[0].baseUnit
    })
  },
  //  保存修改报价
  saveOfferPirce() {
    if (this.data.offerApi.offerPerPrice != ''  && this.data.offerApi.offerPlaces != '' && this.data.offerApi.delivery != '') {
      app.api.saveIronSellInfo(this.data.offerApi).then(res => {
        if (res.code === 1000) {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            success: function () {
              wx.reLaunch({ url: '/pages/offer/index?types=refresh' })
              wx.setStorageSync('from_detail', false)
            }
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
        title: '请填写完整报价信息',
        icon: 'none'
      })
    }
  },
  quitOfferPrice() {
    this.setData({
      isEdit: false
    })
  },
  //  忽略报价
  noPlan() {
    let that = this;
    wx.showModal({
      title: '忽略报价',
      content: '确认忽略报价？',
      success: function (res) {
        if (res.confirm) {
          app.api.missIronSellInfo({ ironBuyId: that.data.objData.id }).then(res => {
            if (res.code === 1000) {
              wx.reLaunch({ url: '/pages/offer/index?types=refresh' })
              wx.setStorageSync('from_detail', false)
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
  //  忽略所有报价
  ignorePrice(e){
    let that = this;
    let apis = e.currentTarget.dataset.apis;
    wx.showModal({
      title: '忽略报价',
      content: '确认忽略报价？',
      success: function (res) {
        if (res.confirm) {
          app.api[apis]({ ironBuyId: that.data.objData.id }).then(res => {
            if (res.code === 1000) {
              wx.reLaunch({ url: '/pages/buyer/index?types=refresh' })
              wx.setStorageSync('from_detail', false)
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 设置导航文字    
    wx.setNavigationBarTitle({
      title: this.data.types == 1 ? '求购详情' : '报价详情'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.removeSysObj();
    wx.setStorageSync('from_detail', true)
  },
  onUnload: function () {
    this.removeSysObj();
    wx.setStorageSync('from_detail', true)
  }
})