// pages/publish/subPages/addNew/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaHide: true,
    model: 'create',
    cIndex: null,
    item: {
      locationId: '',
      locationName: '',
      ironTypeId: '',
      ironTypeName: '',
      materialId: '',
      materialName: '',
      surfaceId: '',
      surfaceName: '',
      proPlacesId: '',
      proPlacesName: '',
      height: '',
      width: '',
      length: '',
      specifications: '',
      tolerance: '',
      numbers: '',
      weights: '',
      numberUnitId: '',
      weightUnitId: '',
      numberUnit: '个',
      weightUnit: '吨',
      remark: '',
      timeLimit: '86400000',
      appFlag: 2
    }
  },
  cityOnpick(e) {
    this.setData({
      'item.locationId': e.detail.id,
      'item.locationName': e.detail.name
    });
  },
  ironOnpick(e) {
    this.setData({
      'item.ironTypeId': e.detail.id,
      'item.ironTypeName': e.detail.name,
      'item.tolerance': (e.detail.name == '不锈钢卷' || e.detail.name == '不锈钢板') ? this.data.item.tolerance : ''
    });
    // 根据选择的品类，查询对应的单位
    app.api.findIronAndUnitByIronId(e.detail.id).then(res => {
      if (res.code === 1000) {
        this.setData({
          'item.numberUnit': res.data.numUnitCName,
          'item.numberUnitId': res.data.numUnitId,
          'item.weightUnitId': res.data.weightUnitId,
          'item.weightUnit': res.data.weightUnitCName
        })
      }
    });
    //如果不是板卷，就清空公差和sepc
    if (this.data.item.ironTypeName != '不锈钢卷' && this.data.item.ironTypeName != '不锈钢板') {
      this.setData({
        'item.tolerance': "",
        'item.specifications': "",
      });
    }
  },
  materialOnpick(e) {
    this.setData({
      'item.materialId': e.detail.id,
      'item.materialName': e.detail.name
    })
  },
  surfaceOnpick(e) {
    this.setData({
      'item.surfaceId': e.detail.id,
      'item.surfaceName': e.detail.name
    })
  },
  proPlacesOnpick(e) {
    this.setData({
      'item.proPlacesId': e.detail
    })
  },
  bindRemark(e) {
    this.setData({
      'item.remark': e.detail.value
    })
  },
  toleranceOninput(e) {
    this.setData({
      'item.tolerance': e.detail
    })
  },
  specOnchange(e) {
    this.setData({
      'item.specifications': e.detail.specifications,
      'item.width': e.detail.width,
      'item.length': e.detail.length,
      'item.height': e.detail.height
    })
  },
  weightOninput(e) {
    let str = e.detail;
    this.setData({
      'item.weights': str
    })
  },
  numberOninput(e) {
    let str = e.detail;
    this.setData({
      'item.numbers': str
    })
  },
  // 检查其他项是否填写
  ckeckItem() {
    let isBJ = this.data.item.ironTypeName == '不锈钢卷' || this.data.item.ironTypeName == '不锈钢板';
    let validItem = app.utils.copyData(this.data.item);
    delete validItem.numbers;
    delete validItem.weights;
    delete validItem.remark;
    delete validItem.proPlacesName;
    if (isBJ) {
      delete validItem.specifications;
    } else {
      delete validItem.width;
      delete validItem.length;
      delete validItem.height;
      delete validItem.tolerance;
    }

    let isOk = true
    Object.keys(validItem).forEach(key => {
      if (validItem[key] === '') {
        isOk = false
        return false
      }
    });
    return isOk
  },
  // 检查单位
  checkUnit() {
    return this.data.item.numbers != '' || this.data.item.weights != ''
  },
  // 保存
  save() {
    if (this.ckeckItem() && this.checkUnit()) {
      if (this.data.model == 'edit') {
        this.pub();
      } else {
        let list = wx.getStorageSync('pbList') || [];
        list.push({
          check: false, ...this.data.item
        });
        wx.setStorageSync('pbList', list);
        wx.switchTab({
          url: '/pages/publish/subPages/pbList/index',
        })
      }
    } else {
      wx.showModal({
        content: '请将数据填写完整！',
        showCancel: false
      })
    }
  },
  // 导航到历史页面
  routeTohis() {
    wx.navigateTo({ url: '/pages/publish/subPages/history/index' })
  },
  // 发布
  pub() {
    if (this.ckeckItem() && this.checkUnit()) {
      let apiUrl = this.data.model == 'edit' ? 'updateIronBuy' : 'saveIronBuy'
      let params = app.utils.copyData(this.data.item);
      params.proPlacesId = JSON.stringify(params.proPlacesId)
      app.api[apiUrl](params).then(res => {
        if (res.code === 1000) {
          wx.showModal({
            content: this.data.model == 'edit' ? '修改完成' : '发布成功',
            showCancel: false,
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
      });
    } else {
      wx.showModal({
        content: '请将数据填写完整！',
        showCancel: false
      })
    }
  },
  //编辑
  edit(){
    if (this.ckeckItem() && this.checkUnit()) {
      let pbList = wx.getStorageSync('pbList');
      pbList[this.data.cIndex] = this.data.item;
      pbList = pbList.map(item => {
        item.check = false
        return item
      })
      wx.setStorageSync('pbList', pbList);
      wx.switchTab({
        url: '/pages/publish/subPages/pbList/index',
      })
    } else {
      wx.showModal({
        content: '请将数据填写完整！',
        showCancel: false
      })
    }
  },
  onLoad(options) {
    this.setData({
      model: options.type || 'create',
      cIndex: options.index || null
    });
    if (options.type == 'edit')
      wx.setNavigationBarTitle({ title: '编辑求购' })

    let item = wx.getStorageSync('cacheIron');
    if (item) {
      delete item.bgStatus
      delete item.buyStatus
      delete item.checkTime
      delete item.createTime
      delete item.updateTime
      delete item.serveTime
      delete item.checkTime
      delete item.time
      delete item.ctime
      delete item.saleTolerance
      item.proPlacesId = typeof item.proPlacesId == 'string' ? JSON.parse(item.proPlacesId) : item.proPlacesId;
      this.setData({ item: item })
    }
  },
  onUnload() {
    wx.removeStorageSync('cacheIron');//删除临时缓存数据
  },
  onHide() {
    app.utils.fireIds(app.formIds, app);
  }

})