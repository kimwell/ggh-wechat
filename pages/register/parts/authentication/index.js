// pages/register/parts/authentication/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: 1,
    steps: [{
      id: 1,
      label: '基本信息'
    }, {
      id: 2,
      label: '业务信息'
    }, {
      id: 3,
      label: '上传证件'
    }, {
      id: 4,
      label: '认证状态'
    }],
    userData: {
      id: '',
      companyName: '',
      regMoney: '',
      contact: '',
      contactNum: '',
      qq: '',
      fax: '',
      provinceId: '',
      provinceName: '',
      cityId: '',
      cityName: '',
      districtId: '',
      districtName: '',
      address: '',
      sellerProfile: '',
      cover: '',
      allCer: '',
      bussinessLic: '',
      codeLic: '',
      financeLic: '',
      saleId: '',
      saleName: '',
      saleMobile: ''
    },
    saleList: [],
    salesIndex: 0,
    cityShow: false,
    uploadImgSrc: '',
    cellType: '0',
    cellArr: ['三证合一', '营业执照+组织机构代码证+税务登记证'],
    cellName: '三证合一',
    pass: '',
    remark: '',
    isFirst: true,
    loadInfo: true
  },
  //  第一步下一步
  stepNext() {
    if (this.data.userData.companyName != '') {
      if (this.data.userData.regMoney != '') {
        this.setData({ step: 2 })
      } else {
        wx.showToast({
          title: '请输入注册资金',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //  第二步 下一步
  stepNexts() {
    if (this.data.userData.contact != '' && this.data.userData.contactNum != '' && this.data.userData.cityName != '' && this.data.userData.address != '') {
      this.setData({
        step: 3
      })
    } else {
      wx.showToast({
        title: '请完善表单信息(星号为必填)',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //  上一步
  preStep(ev) {
    this.setData({ step: Number(ev.currentTarget.dataset.prestep) })
  },
  goStep4() {
    if (this.data.cellType == '0') {
      if (this.data.userData.allCer != '') {
        this.commitInFo()
      } else {
        wx.showToast({
          title: '请上传三证合一照',
          icon: 'none'
        })
      }
    }
    if (this.data.cellType == '1') {
      if (this.data.userData.bussinessLic != '' && this.data.userData.codeLic != '' && this.data.userData.financeLic != '') {
        this.commitInFo()
      } else {
        wx.showToast({
          title: '请上传证件照',
          icon: 'none'
        })
      }
    }
  },
  commitInFo() {
    let that = this;
    let apiUrl = that.data.isFirst ? 'AcUser' : 'AcUserAgain';
    app.api[apiUrl](that.data.userData).then(res => {
      if (res.code === 1000) {
        that.setData({
          pass: res.data.pass,
          step: 4
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },
  bindName(e) {
    this.setData({ 'userData.companyName': e.detail.value })
  },
  bindMoney(e) {
    this.setData({ 'userData.regMoney': e.detail.value })
  },
  bindContact(e) {
    this.setData({ 'userData.contact': e.detail.value })
  },
  bindContactNum(e) {
    this.setData({ 'userData.contactNum': e.detail.value })
  },
  bindQq(e) {
    this.setData({ 'userData.qq': e.detail.value })
  },
  bindFax(e) {
    this.setData({ 'userData.fax': e.detail.value })
  },
  bindAddress(e) {
    this.setData({ 'userData.address': e.detail.value })
  },
  bindPro(e) {
    this.setData({ 'userData.sellerProfile': e.detail.value })
  },
  //  选择专员
  changeSale: function (e) {
    this.setData({
      'userData.saleName': this.data.saleList[e.detail.value].saleName,
      'userData.saleMobile': this.data.saleList[e.detail.value].saleMobile,
      'userData.saleId': this.data.saleList[e.detail.value].saleId,
      salesIndex: e.detail.value
    })
  },
  //  获取专员信息
  getSale() {
    app.api.getSaleMan().then(res => {
      if (res.code === 1000) {
        this.setData({ saleList: this.data.saleList.concat(res.data) })
      }
    })
  },
  //  选择图片
  selectPic(e) {
    let that = this;
    let types = e.currentTarget.dataset.type;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera', 'album'],
      success: function (res) {
        that.uploadImg(res,types)
      },
    })
    // wx.showActionSheet({
    //   itemList: ['拍照', '从相机中选择'],
    //   success(res) {
    //     console.log(res)
    //     if (res.tapIndex === 0) {
    //       wx.chooseImage({
    //         count: 1,
    //         sizeType: ['original', 'compressed'],
    //         sourceType: ['camera'],
    //         success: function (res) {
    //           that.uploadImg(res)
    //         },
    //       })
    //     } else if (res.tapIndex === 1) {
    //       wx.chooseImage({
    //         count: 1,
    //         sizeType: ['original', 'compressed'],
    //         sourceType: ['camera', 'album'],
    //         success: function (res) {
    //           that.uploadImg(res, types)
    //         },
    //       })
    //     }
    //   },
    // })
  },

  // 上传图片
  uploadImg(res, types) {
    let that = this;
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    })
    let auth = wx.getStorageSync('authorization')
    let loginid = wx.getStorageSync('loginId')
    var tempFilePaths = res.tempFilePaths
    wx.uploadFile({
      url: app.api.uploadImage,
      filePath: tempFilePaths[0],
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        'authorization': auth,
        'loginId': loginid,
      },
      success: function (res) {
        if (res.statusCode === 200) {
          var str = res.data.substring(13, 49)
          if (types == '1') {
            that.setData({
              'userData.cover': app.api.aliClound + str
            })
          } else if (types == '2') {
            that.setData({
              'userData.allCer': app.api.aliClound + str
            })
          } else if (types == '3') {
            that.setData({
              'userData.bussinessLic': app.api.aliClound + str
            })
          } else if (types == '4') {
            that.setData({
              'userData.codeLic': app.api.aliClound + str
            })
          } else if (types == '5') {
            that.setData({
              'userData.financeLic': app.api.aliClound + str
            })
          }
        }
        wx.hideToast();
      },
      fail() {
        wx.hideToast();
      }
    })
  },
  //  选择城市
  // showCity() {
  //   this.setData({ 'cityShow': true })
  // },
  cityOnpick(e) {
    let pick = e.detail.pickArr
    this.setData({
      'userData.provinceId': pick[0].id,
      'userData.provinceName': pick[0].name,
      'userData.cityId': pick[1].id,
      'userData.cityName': pick[1].name,
      'userData.districtId': pick[2].id,
      'userData.districtName': pick[2].name,
    })
  },
  // 选择证件类型
  changeCell(e) {
    this.setData({
      cellType: e.detail.value,
      cellName: this.data.cellArr[e.detail.value]
    })
    //  组织机构，三证合一只能选择其一
    if (e.detail.value === '0') {
      this.setData({
        'userData.bussinessLic': '',
        'userData.codeLic': '',
        'userData.financeLic': ''
      })
    } else {
      this.setData({
        'userData.allCer': ''
      })
    }
  },
  //  获取商户信息
  getBuserInfo() {
    let user = wx.getStorageSync('user')
    let params = {
      companyId: user.companyId
    }
    app.api.getBuserInfoByUserId(params).then(res => {
      if (res.code === 1000) {
        if (res.data.buserInfo) {
          this.setData({
            pass: res.data.buserInfo.pass,
            remark: res.data.buserInfo.remark
          })
          let resPass = res.data.buserInfo.pass;
          if (resPass == undefined || resPass == '') {
            this.setData({ step: 1 })
          } else if (resPass == 1 || resPass == 2 || resPass == 3) {
            this.setData({ step: 4 })
          }
          Object.keys(this.data.userData).forEach(key => this.data.userData[key] = res.data.buserInfo[key] ? res.data.buserInfo[key] : '');
          if (this.data.userData.allCer != '') {
            this.setData({ cellType: '0' })
          } else {
            this.setData({ cellType: '1' })
          }
        } else {
          this.setData({ pass: undefined })
        }
      }
    })
  },
  stepOk() {
    app.utils.getUserInfo(app);
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  goDetail() {
    wx.setStorageSync('data', this.data.userData)
    wx.setStorageSync('pass', this.data.pass)
    wx.navigateTo({
      url: '/pages/register/parts/authDetail/index'
    })
  },
  reCommit() {
    this.setData({
      isFirst: false,
      step: 1,
      userData: this.data.userData,
      cellType: this.data.cellType
    })
    this.reEdit();
  },

  //  编辑初始化数据
  reEdit(){
    if (this.data.userData.saleId != '') {
      this.data.saleList.forEach((el, index) => {
        if (this.data.userData.saleId === el.saleId) {
          this.setData({
            salesIndex: index
          })
        }
      })
    }
    if (this.data.userData.allCer != '') {
      this.setData({
        cellName: '三证合一',
        cellType: 0
      })
    } else {
      this.setData({
        cellName: '营业执照+组织机构代码证+税务登记证',
        cellType: 1
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSale();
    //  页面从查看资料过来？
    let pages = getCurrentPages();
    if (pages.length > 1) {
      if (pages[1].route == 'pages/register/parts/authDetail/index') {
        Object.keys(this.data.userData).forEach(key => this.data.userData[key] = pages[pages.length - 2].data.data[key] ? pages[pages.length - 2].data.data[key] : '');
        this.setData({
          loadInfo: false,
          isFirst: false,
          step: 1,
          pass: pages[pages.length - 2].data.pass,
          userData: this.data.userData
        })
        this.reEdit();
      }
    }
    if (this.data.loadInfo) {
      this.getBuserInfo();
    }
    if (this.data.cellType === '1') {
      this.setData({ cellName: this.data.cellArr[1] })
    } else {
      this.setData({ cellName: this.data.cellArr[0] })
    }
  }
})