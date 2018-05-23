// pages/publish/pages/pbList/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    checkAll: false,
    canDel: false,
    checkNum: 0,
    delBtnWidth: 200
  },

  getPbList(func) {
    let list = wx.getStorageSync('pbList') || [];
    list = list.map(item => {
      item.proPlacesName = app.utils.proStr(item.proPlacesId);
      item.check = false;
      delete item.txtStyle
      return item
    });
    this.setData({
      list: list,
      checkNum: 0,
      checkAll: false
    })
    if (func) func()
  },
  addNew(e) {
    if (e.detail.formId != 'the formId is a mock one') {
      app.formIds.push({
        formId: e.detail.formId,
        date: new Date().getTime()
      })
    }
    if (this.data.list.length < 6) {
      wx.navigateTo({
        url: '/pages/publish/subPages/addNew/index'
      })
    } else {
      wx.showToast({
        title: '最多同时编辑6条求购',
        icon: 'none',
        duration: 2000
      })
    }
  },
  check(e) {
    if (e.detail.formId != 'the formId is a mock one') {
      app.formIds.push({
        formId: e.detail.formId,
        date: new Date().getTime()
      })
    }
    let index = e.target.dataset.i;
    let clickItem = `list[${index}].check`;
    this.setData({
      [clickItem]: !this.data.list[index].check
    });
    this.setCheckAllCanDel();
  },
  allCheck(e) {
    if (e.detail.formId != 'the formId is a mock one') {
      app.formIds.push({
        formId: e.detail.formId,
        date: new Date().getTime()
      })
    }
    let list = this.data.list.map(item => {
      item.check = !this.data.checkAll;
      return item
    });
    this.setData({
      list: list
    });
    this.setCheckAllCanDel();
  },
  setCheckAllCanDel() {
    let uncheckLen = this.getSelect(false).length;
    this.setData({
      checkNum: this.data.list.length - uncheckLen,
      checkAll: uncheckLen == 0 && this.data.list.length > 0,
      canDel: uncheckLen < this.data.list.length
    })
  },
  // 滑动逻辑模拟
  //手指刚放到屏幕触发
  touchS: function (e) {
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      let list = this.data.list;
      list.map(item => {
        if (item.txtStyle) {
          delete item.txtStyle;
          return
        }
      })
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX,
        list: list
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function (e) {
    let that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      let moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      let disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      let delBtnWidth = that.data.delBtnWidth;
      let txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }
      //获取手指触摸的是哪一个item
      let index = e.currentTarget.dataset.index;
      let key = 'list[' + index + '].txtStyle';
      //更新列表的状态
      this.setData({
        [key]: txtStyle
      });
    }
  },
  touchE: function (e) {
    let that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      let endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      let disX = that.data.startX - endX;
      let delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      let txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0";
      //获取手指触摸的是哪一个item
      let index = e.currentTarget.dataset.index;
      let key = 'list[' + index + '].txtStyle';
      //更新列表的状态
      this.setData({
        [key]: txtStyle
      });
    }
  },
  delsome(e) {
    if (e.detail.formId != 'the formId is a mock one') {
      app.formIds.push({
        formId: e.detail.formId,
        date: new Date().getTime()
      })
    }
    wx.showModal({
      content: '是否确定删除？',
      success: res => {
        if (res.confirm) {
          wx.showToast({
            title: '已删除',
            icon: 'success',
            duration: 2000
          });
          wx.setStorageSync('pbList', this.getSelect(false));
          this.getPbList(this.setCheckAllCanDel());
        }
      }
    })

  },
  // 删除
  del(e) {
    if (e.detail.formId != 'the formId is a mock one') {
      app.formIds.push({
        formId: e.detail.formId,
        date: new Date().getTime()
      })
    }
    wx.showModal({
      content: '是否确认删除？',
      success: (res) => {
        let index = e.currentTarget.dataset.index;
        if (res.confirm) {
          let publishlist = wx.getStorageSync('pbList');
          publishlist.splice(index, 1);
          wx.setStorageSync('pbList', publishlist);
          this.getPbList(this.setCheckAllCanDel());
        } else if (res.cancel) {
          let slide = 'list[' + index + '].slide';
          this.setData({
            [slide]: false
          });
        }
      }
    })
  },

  // 导航到历史页面
  routeTohis() {
    wx.navigateTo({ url: '/pages/publish/subPages/history/index' })
  },
  // 复制
  copy(e) {
    if (e.detail.formId != 'the formId is a mock one') {
      app.formIds.push({
        formId: e.detail.formId,
        date: new Date().getTime()
      })
    }
    let index = e.currentTarget.dataset.index;
    let slide = 'list[' + index + '].slide';
    // 判断是否已经存满6条
    if (this.data.list.length >= 6) {
      wx.showModal({
        title: '警告',
        content: '最多保存6条求购信息',
        showCancel: false,
        success: (res) => {
          this.setData({
            [slide]: false
          });
        }
      })
      return
    }

    // // 可以添加
    let data = app.utils.copyData(this.data.list[index]);
    delete data.check;
    delete data.slide;
    data.proPlacesName = data.proPlacesName.replace(/;/g, ",");
    data.uuid = app.utils.getuuId();
    wx.setStorageSync('cacheIron', data);
    wx.navigateTo({ url: '/pages/publish/subPages/addNew/index?type=copy' })

  },

  // 编辑
  edit(e) {
    console.log(111222)
    if (e.detail.formId != 'the formId is a mock one') {
      app.formIds.push({
        formId: e.detail.formId,
        date: new Date().getTime()
      })
    }
    let index = e.currentTarget.dataset.index;

    let data = app.utils.copyData(this.data.list[index]);
    delete data.check;
    delete data.slide;
    data.proPlacesName = data.proPlacesName.replace(/;/g, ",");
    data.uuid = app.utils.getuuId();
    wx.setStorageSync('cacheIron', data);
    wx.navigateTo({ url: '/pages/publish/subPages/addNew/index?type=edit&index=' + index })
  },
  // 获取选中的item
  getSelect(isCheck = true) {
    return this.data.list.filter(item => item.check == isCheck);
  },
  // 批量发布
  pubSome(e) {
    if (e.detail.formId != 'the formId is a mock one') {
      app.formIds.push({
        formId: e.detail.formId,
        date: new Date().getTime()
      })
    }
    if (this.data.checkNum == 0) return
    app.api.saveIronBuyList({ ironBuyInfos: JSON.stringify(this.getSelect()) }).then(res => {
      if (res.code === 1000) {
        wx.setStorageSync('pbList', this.getSelect(false));
        this.getPbList(this.setCheckAllCanDel());
        // 跳转至求购
        wx.showModal({
          content: '发布成功',
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({ url: '/pages/buyer/index?types=refresh' })
              wx.setStorageSync('from_detail', false)
            }
          }
        })
      } else {
        wx.showModal({
          content: res.message,
          showCancel: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.role !== 'vip' && app.role !== 'admin') {
      // 是否有角色
      let isNormal = app.role == 'normal';
      wx.showModal({
        content: isNormal ? '前往认证' : '权限不足!',
        // showCancel: false,
        success: function (res) {
          if (res.confirm) {
            if (isNormal) {
              // 前往认证
              wx.navigateTo({ url: '/pages/register/parts/authentication/index' });
            } else {
              // 返回首页
              wx.switchTab({ url: '/pages/index/index' })
            }
          } else if (res.cancel) {
            // 返回首页
            wx.switchTab({ url: '/pages/index/index' })
          }
        }
      })
    } else {
      this.getPbList();
    }
  },
  onHide() {
    app.utils.fireIds(app.formIds, app);
  }
})