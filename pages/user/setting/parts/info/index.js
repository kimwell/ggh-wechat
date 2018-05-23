const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: {
      contact: '',
      contactNum: '',
      qq: '',
      provinceId: '',
      provinceName: '',
      cityId: '',
      cityName: '',
      districtId: '',
      districtName: '',
      address: '',
      storeHouseId: '',
      storeHouseName: ''
    },
    companyName: '',
    mobile: '',
    usrType: '',
    storeList: [],
    storeIndex: 0
  },
  cityOnpick(e) {
    this.setData({
      'userData.provinceName': e.detail.pickArr[0].name,
      'userData.provinceId': e.detail.pickArr[0].id,
      'userData.cityName': e.detail.pickArr[1].name,
      'userData.cityId': e.detail.pickArr[1].id
    })
  },
  bindPickerChange(e) {
    this.setData({
      storeIndex: e.detail.value
    })
    this.setData({
      'userData.storeHouseName': this.data.storeList[this.data.storeIndex].name,
      'userData.storeHouseId': this.data.storeList[this.data.storeIndex].id
    })
  },
  nameHandle(e) {
    this.setData({
      'userData.contact': e.detail.value
    })
  },
  qqHandle(e) {
    this.setData({
      'userData.qq': e.detail.value
    })
  },
  addressHandle(e) {
    this.setData({
      'userData.address': e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCurrentUser();
    this.getStoreHouse();
  },
  getCurrentUser() {
    app.api.findCurrentUser().then(res => {
      if (res.code === 1000) {
        Object.keys(this.data.userData).forEach(key => this.data.userData[key] = res.data.buserInfo[key] ? res.data.buserInfo[key] : '');
        this.setData({
          userData: this.data.userData,
          companyName: res.data.companyName,
          mobile: res.data.mobile,
          usrType: res.data.usrType
        })
      }
    })
  },
  getStoreHouse() {
    app.api.findStoreHouse().then(res => {
      if (res.code === 1000) {
        this.setData({
          storeList: this.data.storeList.concat(res.data)
        })
        res.data.forEach((el, index) => {
          if (el.name === this.data.userData.storeHouseName) {
            this.setData({
              storeIndex: index
            })
          }
        })
      }
    })
  },
  saveInfos() {
    app.api.updateBInfo(this.data.userData).then(res => {
      if (res.code === 1000) {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000,
          success: function () {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  },
  giveUpInfo() {
    wx.navigateBack({
      delta: 1
    })
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

  }
})