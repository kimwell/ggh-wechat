const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceData: {
      id: '',
      price: '',
      tolerance: '',
      proPlaceId: '',
      baseUnitId: '',
      baseUnit: '',
      proPlace: '',
      remark: '',
      deliveryTime: ''
    },
    textareaHide: true,
    deliveryTime: '',
    // units: [],
    // unit: ['吨','之'],
    // unitIndex: 0,
    ironType: ''
  },
  // 取消修改报价
  cancelPrice() {
    wx.navigateBack();
  },
  //  确认修改报价
  savePrice() {
    let isOk = true;
    let apiData = app.utils.copyData(this.data.priceData);
    delete apiData.remark
    if (this.data.ironType != '不锈钢板' && this.data.ironType != '不锈钢卷'){
      delete apiData.tolerance
    }

    Object.keys(apiData).map(key => {
      if(apiData[key] == ''){
        isOk = false
      }
    });

    if(isOk){
      let params = app.utils.copyData(this.data.priceData);
      params.deliveryTime = new Date(this.data.priceData.deliveryTime).getTime()
      app.api.updateStoreOrder(params).then(res => {
        if (res.code === 1000) {
          wx.showModal({
            title: '修改成功',
            showCancel: false,
            success: function (data) {
              if (data.confirm) {
                wx.navigateBack();
              }
            }
          })
        } else {
          wx.showToast({
            title: res.message,
          })
        }
      })
    }else{
      wx.showModal({
        title: '输入提示',
        content: '请将数据填写完整！'
      })
    }
    
    
  },
  //  产地
  proPlacesOnpick(e) {
    this.setData({
      'priceData.proPlaceId': e.detail.id,
      'priceData.proPlace': e.detail.name
    })
  },
  // 交货日期
  changeDate(e) {
    this.setData({
      deliveryTime: e.detail.value,
      'priceData.deliveryTime': e.detail.value,
    })
  },
  //  输入单价
  priceHandle(e) {
    this.setData({
      'priceData.price': e.detail.value
    })
  },
  //  输入公差
  toleranceHandle(e) {
    this.setData({
      'priceData.tolerance': e.detail.value
    })
  },
  //  输入备注
  markHandle(e) {
    this.setData({
      'priceData.remark': e.detail.value
    })
  },
  unitChange(e){
    this.setData({
      unitIndex: e.detail.value,
      'priceData.baseUnit': this.data.units[e.detail.value].name,
      'priceData.baseUnitId': this.data.units[e.detail.value].id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let unit = []
    JSON.parse(options.units).map(item => {
      unit.push(item.name);
    })
    this.setData({
      'priceData.id': options.ironBuyId,
      'priceData.price': options.offerPerPrice,
      'priceData.tolerance': options.tolerance,
      'priceData.proPlaceId': options.offerPlacesId,
      'priceData.proPlace': options.offerPlaces,
      'priceData.baseUnitId': options.baseUnitId,
      'priceData.baseUnit': options.baseUnit,
      'priceData.remark': options.offerRemark,
      'priceData.deliveryTime': options.delivery,
      deliveryTime: options.delivery,
      // unit: unit,
      // units: JSON.parse(options.units),
      ironType: options.ironType
    })
  }
})