// pages/index/news/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    active: 0,
    list: []
  },

  switchTab(e) {
    let i = e.currentTarget.dataset.i;
    this.setData({ active: i });
    this.getNewslist();
  },
  getNewslist() {
    let id = this.data.tabs[this.data.active].id;
    if (id == '') return
    app.api.getNewslist({
      currentPage: 1,
      pageSize: 10,
      articleTypeId: id
    }).then(res => {
      if (res.code === 1000) {
        let data = res.data.newList.map(item => {
          item.time = app.utils.getDateDiff(item.updateTime)
          item.title = app.utils.intercept(item.title,25);
          return item
        });
        this.setData({ list: data});
      }
    })
  },

  getNewsType() {
    app.api.getNewslist({
      currentPage: 1,
      pageSize: 0,
      articleTypeId: ''
    }).then(res => {
      if (res.code === 1000) {
        let tabs = res.data.articelTypeList
          .filter(item => item.articelTypeId != '')
          .map(item => {
            if (item.articelTypeId != '') return {
              label: item.articelTypeName,
              id: item.articelTypeId
            }
          });
        this.setData({ tabs: tabs });

        this.getNewslist();
      }
    })
  },

  // 跳转详情
  routeDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/index/newsDetail/index?id=' + id});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNewsType();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})