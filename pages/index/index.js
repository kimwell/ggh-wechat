//index.js
//获取应用实例
const app = getApp();


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    filterTags: [{
      label: '500W',
      groupId: '3559'
    }, {
      label: '100W',
      groupId: '3569'
    }, {
      label: '50W',
      groupId: '3580'
    }],
    tagActive: 0,
    shopList: [],
    defaultImg: ''
  },
  //事件处理函数
  formSubmit(e) {
    if (e.detail.formId != 'the formId is a mock one') {
      app.formIds.push({
        formId: e.detail.formId,
        date: new Date().getTime()
      })
    }
    if (e.currentTarget.dataset.ismain) {
      wx.switchTab({
        url: e.currentTarget.dataset.to
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.to
      })
    }
  },

  // 跳转详情
  routeDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/index/newsDetail/index?id=' + id });
  },
  //点击切换商户
  filterT(e) {
    let index = e.target.dataset.index;
    this.setData({ tagActive: index })
    if (e.detail.formId != 'the formId is a mock one') {
      app.formIds.push({
        formId: e.detail.formId,
        date: new Date().getTime()
      })
    }
    this.getAds();
  },
  getAds(){
    // 获取商户广告
    app.api.getSHopAd({ groupId: this.data.filterTags[this.data.tagActive].groupId }).then(res => {
      if (res.code === 1000) {
        let result = [];
        let data = res.data.data.adList || [];
        for (let i = 0, len = data.length; i < len; i += 2) {
          result.push(data.slice(i, i + 2));
        }
        this.setData({
          shopList: result,
          defaultImg: res.data.data.defaultImg || ''
        })
      }
    })
  },
  onLoad: function () {
    // 获取新闻
    app.api.getNewslist({
      currentPage: 1,
      pageSize: 4,
      articleTypeId: ''
    }).then(res => {
      if (res.code === 1000) {
        let list = res.data.newList.map(item => {
          item.pbDate = app.utils.dateformat(item.updateTime, 'yyyy-MM-dd');
          item.inTitile = app.utils.intercept(item.title, 18);
          return item
        });
        this.setData({ newsList: list })
      }
    });
    this.getAds();
  },
  onHide() {
    app.utils.fireIds(app.formIds, app);
  }

})