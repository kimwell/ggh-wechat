// components/orderTemp/salesmanSome/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickerShow: false,
    allCheck: false,
    list: [],
    sales: [],
    activeSale: null,
    checkCount: 0
  },
  // 获取为绑定商品
  getShops() {
    app.api.findBindBuy().then(res => {
      if (res.code === 1000) {
        this.setData({
          list: res.data.map(item => {
            item.check = false;
            return item
          })
        })
      }
    })
  },
  // 获取业务员
  getSales() {
    app.api.querySalls({
      companyId: app.userInfo.companyId
    }).then(res => {
      if (res.code === 1000) {
        this.setData({
          sales: res.data
        })
      }
    })
  },
  // 选择商家
  checItem(e) {
    let i = e.currentTarget.dataset.i;
    let list = app.utils.copyData(this.data.list);
    list[i].check = !this.data.list[i].check;
    this.setData({
      list: list
    });
    this.checkAll();
  },

  // 选择业务员
  pickSaler(e) {
    let i = e.currentTarget.dataset.i;
    this.setData({ activeSale: i, pickerShow: false });
  },
  // 检查是否要设置全选
  checkAll() {
    let isCheck = this.data.list.filter(item => !item.check);
    this.setData({
      allCheck: isCheck.length == 0 && this.data.list.length > 0
    });
    this.setCount();
  },
  // 全选
  setCheckAll() {
    let list = this.data.list.map(item => {
      item.check = !this.data.allCheck
      return item
    })

    this.setData({
      list: list,
      allCheck: !this.data.allCheck
    });

    this.setCount();
  },
  //数数
  setCount() {
    this.setData({
      checkCount: this.data.list.filter(item => item.check).length
    })
  },

  showPicker() {
    this.setData({
      pickerShow: true
    })
  },

  hidePicker() {
    this.setData({
      pickerShow: false
    })
  },

  //批量分配
  fpSome() {
    if (this.data.activeSale != null && this.data.checkCount > 0) {
      let ids = [];
      this.data.list.map(item => {
        if (item.check) {
          ids.push(item.buyId);
        }
      })

      app.api.bindSalemans({
        buyId: JSON.stringify(ids),
        saleId: this.data.sales[this.data.activeSale].saleId
      }).then(res => {
        if (res.code === 1000) {
          wx.showModal({
            title: '分配成功',
            showCancel: false,
            success: function(data)  {
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
    } else {
      wx.showModal({
        title: this.data.activeSale == null ? '请选择业务员' : '请选择商家',
        showCancel: false
      })
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getShops();
    this.getSales();
  }
})