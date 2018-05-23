const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navData: [{
      id: 0,
      name: '待报价',
      count: 0
    }, {
      id: 1,
      name: '待确认',
      count: 0
    }, {
      id: 2,
      name: '已成交',
      count: 0
    }, {
      id: 3,
      name: '已失效',
      count: 0
    }],
    filterData: {
      currentPage: 0,
      pageSize: 10,
      buyStatus: 0,
      today: 1
    },
    uuid: '',
    pull: '',
    isNormal: ''
  },
  onLoad: function (options) {
    if (options.types == 'refresh') {
      wx.setStorageSync('from_detail', false)
      let uuid = app.utils.getuuId();
      this.setData({
        pull: 'down',
        // uuid: uuid
      })
    }
  },
  goAuth(){
    app.utils.getUserInfo(app);
    wx.navigateTo({
      url: '/pages/register/parts/authentication/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isNormal: app.role
    })
    // if (app.role !== 'vip' && app.role !== 'admin') {
    // 是否有角色
    // let isNormal = app.role == 'normal';
    // wx.showModal({
    //   content: isNormal ? '前往认证' : '权限不足!',
    //   // showCancel: false,
    //   success: function (res) {
    //     if (res.confirm) {
    //       if (isNormal) {
    //         // 前往认证
    //         wx.navigateTo({ url: '/pages/register/parts/authentication/index' });
    //       } else {
    //         // 返回首页
    //         wx.switchTab({ url: '/pages/index/index' })
    //       }
    //     }else if(res.cancel){
    //       wx.switchTab({ url: '/pages/index/index' })
    //     }
    //   }
    // })
    // } else {
    // let uuid = app.utils.getuuId();
    // this.setData({
    //   uuid: uuid
    // });
    // }
  },
  onUnload: function () {
    wx.removeStorageSync('from_detail')
  },
  onHide: function () {
    wx.removeStorageSync('from_detail')
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    let uuid = app.utils.getuuId();
    this.setData({
      uuid: uuid,
      pull: 'down'
    })
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    let uuid = app.utils.getuuId();
    this.setData({
      uuid: uuid,
      pull: 'up'
    })
  }
})