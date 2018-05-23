// components/orderTemp/Salesman/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFirst: true,
    buyCompny: '',
    storeOrderId: '',
    saleMan: '',
    saleMobile: '',
    list: []
  },

  getSales() {
    app.api.querySalls({
      companyId: app.userInfo.companyId
    }).then(res => {
      if (res.code === 1000) {
        this.setData({
          list: res.data
        })
      }
    })
  },

  // 绑定
  pick(e) {
    let item = e.currentTarget.dataset.item;
    wx.showModal({
      title: '确认提示',
      content: '是否确认分配给' + item.saleName,
      success: (r) => {
        if (r.confirm) {
          app.api.bindSaleman({
            storeOrderId: this.data.storeOrderId,
            saleId: item.saleId
          }).then(res => {
            
            if (res.code === 1000) {
              wx.showModal({
                title: this.data.isFirst ? '绑定成功' : '换绑成功',
                content: this.data.isFirst ? '绑定已经完成' : '换绑已完成',
                showCancel: false,
                success: function (res1) {
                  if (res1.confirm) {
                    wx.navigateBack();
                  }
                }
              })
            } else {
              wx.showToast({
                title: res.message
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isFirst: options.saleId == '',
      buyCompny: options.buyCompny,
      storeOrderId: options.storeOrderId,
      saleMan: options.saleMan,
      saleMobile: options.saleMobile
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: this.data.isFirst ? '绑定业务员' : '换邦业务员'
    });
    this.getSales();
  },
})