const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navData: [{
      id: 0,
      name: '买家中心'
    }, {
      id: 1,
      name: '卖家中心'
    }],
    status: 0,
    buyerData: [{
      name: '发起求购次数',
      count: 0
    }, {
      name: '有货报价求购次数',
      count: 0
    }, {
      name: '求购有货报价率',
      count: 0
    }, {
      name: '求购订单总量',
      count: 0
    }, {
      name: '求购中标率',
      count: 0
    }, {
      name: '求购合作卖家数',
      count: 0
    }, {
      name: '订单完成数',
      count: 0
    }, {
      name: '订单完成率',
      count: 0
    }, {
      name: '订单作废数',
      count: 0
    }, {
      name: '卖家取消订单数',
      count: 0
    }],
    sellerData: [{
      name: '报价次数',
      count: 0
    }, {
      name: '有货报价次数',
      count: 0
    }, {
      name: '有货报价率',
      count: 0
    }, {
      name: '报价订单总量',
      count: 0
    }, {
      name: '中标率',
      count: 0
    }, {
      name: '新增客户量',
      count: 0
    }, {
      name: '订单完成次数',
      count: 0
    }, {
      name: '订单完成率',
      count: 0
    }, {
      name: '订单作废次数',
      count: 0
    }, {
      name: '订单放弃次数',
      count: 0
    }],
    apiData: {
      companyId: '',
      dateBegin: '',
      dateEnd: '',
    },
    startTime: '',
    endTime: '',
    today: ''
  },
  // tab切换
  switchNav(e) {
    let id = e.currentTarget.dataset.idx;
    this.setData({
      status: id,
    })
    let today = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    let todayEnd = new Date(new Date().setHours(0, 0, 0, 0)).getTime() + 86400000;
    this.setData({
      'apiData.dateBegin': today,
      'apiData.dateEnd': todayEnd,
      startTime: app.utils.dateformat(today, 'yyyy-MM-dd'),
      endTime: app.utils.dateformat(todayEnd, 'yyyy-MM-dd'),
    })
    if (id === 0) {
      this.getBuyer();
    } else if (id === 1) {
      this.getseller();
    }
  },
  //  选择开始时间picker
  changeStart(e) {
    let val = e.detail.value
    this.setData({
      startTime: val,
      'apiData.dateBegin': this.tranData(val),
    })
  },
  //  选择结束时间picker
  changeEnd(e) {
    let val = e.detail.value
    this.setData({
      endTime: val,
      'apiData.dateEnd': this.tranData(val),
    })
  },
  //  年月日转毫秒时间戳
  tranData(val) {
    var date = val;
    date = date.replace(/-/g, '/');
    var time = new Date(date).getTime();
    return time
  },
  //  清空
  clearData() {
    this.setData({
      'apiData.dateBegin': '',
      'apiData.dateEnd': '',
      startTime: '',
      endTime: ''
    })
  },
  //  查询
  searchBtn() {
    if (this.data.startTime != '' && this.data.endTime == '') {
      wx.showToast({
        title: '请选择结束时间',
        icon: 'none'
      })
    } else if (this.data.startTime == '' && this.data.endTime != '') {
      wx.showToast({
        title: '请选择开始时间',
        icon: 'none'
      })
    } else {
      var d1 = new Date(this.data.startTime.replace(/\-/g, "\/"));
      var d2 = new Date(this.data.endTime.replace(/\-/g, "\/"));
      if (d1 >= d2) {
        wx.showToast({
          title: '开始时间不能大于结束时间',
          icon: 'none'
        })
        return false;
      } else {
        if (this.data.status === 0) {
          this.getBuyer();
        } else if (this.data.status === 1) {
          this.getseller();
        }
      }
    }
  },
  getBuyer() {
    let that = this;
    app.api.statistical(this.data.apiData).then(res => {
      if (res.code === 1000) {
        this.data.buyerData[0].count = res.data.ironBuyNum;
        this.data.buyerData[1].count = res.data.ironSellerNum;
        this.data.buyerData[2].count = Number(res.data.ironSellerPercent).toFixed(2) + '%';
        this.data.buyerData[3].count = res.data.storeOrderNum;
        this.data.buyerData[4].count = Number(res.data.storeOrderPercent).toFixed(2) + '%';
        this.data.buyerData[5].count = res.data.buserNum;
        this.data.buyerData[6].count = res.data.storeOrderFinishNum;
        this.data.buyerData[7].count = Number(res.data.storeOrderFinishPercent).toFixed(2) + '%';
        this.data.buyerData[8].count = res.data.storeOrderWasteNum;
        this.data.buyerData[9].count = res.data.storeOrderCancelNum;
        this.setData({
          buyerData: this.data.buyerData
        })
      }
    })
  },
  getseller() {
    let that = this;
    app.api.sellerStatistical(this.data.apiData).then(res => {
      if (res.code === 1000) {
        this.data.sellerData[0].count = res.data.ironSellNum;
        this.data.sellerData[1].count = res.data.ironSellerNum;
        this.data.sellerData[2].count = Number(res.data.ironSellerPercent).toFixed(2) + '%';
        this.data.sellerData[3].count = res.data.ironSellerSuccessNum;
        this.data.sellerData[4].count = Number(res.data.ironSellerSuccessPercent).toFixed(2) + '%';
        this.data.sellerData[5].count = res.data.newCustomerNum;
        this.data.sellerData[6].count = res.data.storeOrderFinishNum;
        this.data.sellerData[7].count = Number(res.data.storeOrderFinishPercent).toFixed(2) + '%';
        this.data.sellerData[8].count = res.data.storeOrderWasteNum;
        this.data.sellerData[9].count = res.data.storeOrderCancelNum;
        this.setData({
          sellerData: this.data.sellerData
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let today = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    let todayEnd = new Date(new Date().setHours(0, 0, 0, 0)).getTime() + 86400000;
    this.setData({
      'apiData.companyId': options.id,
      'apiData.dateBegin': today,
      'apiData.dateEnd': todayEnd,
      startTime: app.utils.dateformat(today, 'yyyy-MM-dd'),
      endTime: app.utils.dateformat(todayEnd, 'yyyy-MM-dd'),
      today: app.utils.dateformat(todayEnd, 'yyyy-MM-dd')
    })
    this.getBuyer()
  }
})