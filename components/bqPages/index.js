const app = getApp();
let loadType;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    types: {
      type: Number,
      value: 1
    },
    navData: {
      type: Array
    },
    DataApi: {
      type: String
    },
    filterApi: {
      type: Object
    },
    uuid: {
      type: String,
      observer: function (newVal, oldVal) {
        let that = this;
        let fd = wx.getStorageSync('from_detail')
        if (newVal != oldVal) {
          // if (fd != true || loadType == 'up') {
          //   this.loadMore();
          // }
          if (loadType == 'down') {
            this.setData({
              list: [],
              'filterData.currentPage': 0,
              hasMore: true
            })
            this.loadMore();
          } else if (loadType == 'up') {
            this.loadMore();
          }
        }
      }
    },
    pull: {
      type: String,
      observer(newVal, oldVal) {
        if (newVal != oldVal) {
          loadType = newVal
          if (newVal == 'down' && oldVal != '' && oldVal != 'up') {
            this.setData({
              list: [],
              'filterData.currentPage': 0,
              hasMore: true
            })
            this.loadMore();
          }
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    nav: [],
    status: 0,
    today: false,
    list: [],
    hasMore: true,
    filterData: {},
    maskShow: false,
    tapIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //  导航切换
    navTap(e) {
      let that = this;
      let idx = e.currentTarget.dataset.id;
      if (this.data.filterData.buyStatus == idx || this.data.filterData.offerStatus == idx) return;
      this.setData({
        status: idx,
        'filterData.currentPage': 0,
        hasMore: true,
        list: []
      })
      if (this.data.types === 1) {
        this.setData({
          'filterData.buyStatus': idx
        })
      } else if (this.data.types === 2) {
        this.setData({
          'filterData.offerStatus': idx
        })
      }
      that.loadMore();
    },
    //  今天
    switchToday() {
      let that = this;
      this.setData({
        today: !this.data.today,
        hasMore: true,
        'filterData.currentPage': 0,
        list: []
      })
      if (this.data.today) {
        this.setData({
          'filterData.today': 1
        })
      } else {
        this.setData({
          'filterData.today': 0
        })
      }
      that.loadMore();
    },
    //  加载更多
    loadMore() {
      let that = this;
      let dataApi = that.data.dataApi;
      if (!that.data.hasMore) return;
      that.setData({
        'filterData.currentPage': that.data.filterData.currentPage + 1
      })
      app.api[that.data.DataApi](that.data.filterData).then(res => {
        if (res.code === 1000) {
          //  日期格式化
          res.data.list.forEach(el => {
            el.isShow = false;
            el.time = app.utils.dateformat(el.updateTime);
            el.ctime = app.utils.dateformat(el.createTime);
            //  交货日期格式化
            if (this.data.types == 2) {
              el.ironSell.forEach(sub => {
                sub.dtime = app.utils.dateformat(sub.deliveryTime, 'yyyy-MM-dd');
              })
            }
          })
          if (that.data.filterData.currentPage === 1) {
            if (that.data.types === 1) {
              if (that.data.nav) {
                that.setData({
                  'nav[0].count': res.data.ing,
                  'nav[1].count': res.data.check,
                  'nav[2].count': res.data.get,
                  'nav[3].count': res.data.end,
                })
              }
            } else {
              if (that.data.nav) {
                that.setData({
                  'nav[0].count': res.data.never,
                  'nav[1].count': res.data.offer,
                  'nav[2].count': res.data.deal,
                  'nav[3].count': res.data.miss,
                })
              }
            }
          }
          if (res.data.list.length < that.data.filterData.pageSize) {
            that.setData({
              'hasMore': false,
            })
          }
          that.setData({
            list: that.data.list.concat(res.data.list)
          })
        }
      })
    },
    //  显示删除、编辑、复制
    showOption(e) {
      let id = e.currentTarget.dataset.id;
      let show = 'list[' + id + '].isShow';
      this.setData({
        [show]: true,
        maskShow: true,
        tapIndex: id
      })
    },
    tapMask() {
      let show = 'list[' + this.data.tapIndex + '].isShow'
      this.setData({
        [show]: false,
        maskShow: false
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
          this.setData({
            'filterData.currentPage': 0,
            hasMore: true,
            list: []
          })
          this.loadMore();
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    //  忽略报价
    ignoreBtn(e) {
      let that = this;
      let item = e.currentTarget.dataset.item;
      wx.showModal({
        title: '忽略报价',
        content: '是否忽略报价？忽略后将不可撤销。',
        success: function (res) {
          if (res.confirm) {
            app.api.missIronSellInfo({ ironBuyId: item.id }).then(res => {
              if (res.code === 1000) {
                that.setData({
                  'filterData.currentPage': 0,
                  hasMore: true,
                  list: []
                })
                that.loadMore();
              }
            })
          }
        }
      })
    },
    //  去详情页
    goDetail(e) {
      let types = e.currentTarget.dataset.types;
      let obj = e.currentTarget.dataset.obj;
      wx.setStorageSync('obj', obj)
      wx.navigateTo({
        url: '/pages/bqPages/detail/index?types=' + types,
      })
    },
    //  联系
    makeCall(e) {
      let tel = e.currentTarget.dataset.tel;
      wx.makePhoneCall({
        phoneNumber: tel
      })
    },
    //  修改报价
    modifyPrice(e) {
      let obj = e.currentTarget.dataset.obj;
      let types = e.currentTarget.dataset.types;
      wx.setStorageSync('obj', obj)
      wx.navigateTo({
        url: '/pages/bqPages/detail/index?types=' + types + "&isEdit=1",
      })
    }
  },

  ready() {
    // this.loadMore()
  },
  attached() {
    this.setData({
      nav: this.data.navData,
      filterData: this.data.filterApi,
    })
    if (this.data.filterApi.today === 1) {
      this.setData({
        today: true
      })
    } else {
      this.setData({
        today: false
      })
    }
    if (this.data.types == 1) {
      this.setData({
        status: this.data.filterData.buyStatus
      })
    } else if (this.data.types == 2) {
      this.setData({
        status: this.data.filterData.offerStatus
      })
    }
    if (this.data.list.length === 0) {
      this.setData({
        'filterData.currentPage': 0,
        hasMore: true,
        list: []
      })
      this.loadMore()
    }
  }
})
