const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiData: {
      password: '',
      mobile: '',
      smsCode: ''
    },
    disable: false,
    second: 59,
    send: false
  },
  //  校验不能为空
  checkValue(e, types) {
    if (e.detail.value == '') {
      this.setData({ errorMsg: true })
      if (types === 1) {
        this.setData({
          msg: '手机号码不能为空'
        })
      } else if (types === 2) {
        this.setData({
          msg: '验证码不能为空'
        })
      } else {
        this.setData({
          msg: '新密码不能为空'
        })
      }
    } else {
      this.setData({
        errorMsg: false,
        msg: ''
      })
    }
  },
  userHandle(e) {
    this.checkValue(e, 1)
  },
  msmcodeHandle(e) {
    this.checkValue(e, 2)
  },
  passwordHandle(e) {
    this.checkValue(e, 3)
  },
  userBind(e) {
    this.setData({
      disable: false,
      send: false
    })
    this.setData({ 'apiData.mobile': e.detail.value })
  },
  getMsmCode() {
    let that = this;
    let telReg = /^1[0-9]{10}$/;
    let tel = this.data.apiData.mobile;
    if (tel == '') {
      that.setData({
        errorMsg: true,
        msg: '请输入手机号码'
      })
    } else if (!telReg.test(tel)) {
      that.setData({
        errorMsg: true,
        msg: '手机号码输入有误'
      })
    } else {
      if (!this.data.disable) {
        this.setData({
          disable: true
        })
        this.sendSmsCode();
      }
    }
  },
  sendSmsCode() {
    let that = this;
    let params = { mobile: that.data.apiData.mobile };
    app.api.smsCode(params).then(res => {
      if (res.code === 1000) {
        this.setData({
          send: true
        })
        let currentTime = that.data.second
        let interval = setInterval(function () {
          currentTime--;
          that.setData({
            second: currentTime
          })
          if (currentTime <= 0) {
            clearInterval(interval)
            that.setData({
              second: 59,
              disable: false,
              send: false
            })
          }
        }, 1000);
        wx.showToast({
          title: '发送成功',
          icon: 'none'
        })
        wx.setStorageSync('session_id', res.data)
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },
  //  提交修改密码
  formSubmit(e) {
    let tel = e.detail.value.user;
    let smsCode = e.detail.value.msmcode;
    let password = e.detail.value.password
    if (tel != '' && smsCode != '' && password != '') {
      let params = {
        mobile: tel,
        smsCode: smsCode,
        password: password
      }
      app.api.validateMobile(params).then(res => {
        if (res.code === 1000) {
          wx.showModal({
            title: '修改密码',
            content: '修改成功，点确定重新登录',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/login/index',
                })
              }
            }
          })
          wx.removeStorageSync('session_id')
        } else {
          that.setData({
            errorMsg: true,
            msg: res.message
          })
          wx.removeStorageSync('session_id')
        }
      })
    } else {
      wx.showModal({
        content: '请输入完整信息',
      })
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('session_id')
  }
})