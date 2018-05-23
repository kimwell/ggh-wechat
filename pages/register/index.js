// pages/register/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    regApi: {
      passwordOne: '',
      passwordTwo: '',
      mobile: '',
      smsCode: '',
      picCode: '',
      flag: 1
    },
    disable: false,
    second: 59,
    send: false
  },
  bindUser(ev) {
    this.setData({
      disable: false,
      send: false
    })
    this.setData({
      'regApi.mobile': ev.detail.value
    })
  },
  bindCode(ev) {
    this.setData({
      'regApi.smsCode': ev.detail.value
    })
  },
  bindPsd1(ev) {
    this.setData({
      'regApi.passwordOne': ev.detail.value
    })
  },
  bindPsd2(ev) {
    this.setData({
      'regApi.passwordTwo': ev.detail.value
    })
  },
  //  校验不能为空
  checkValue(e) {
    let types = e.currentTarget.dataset.types;
    if (e.detail.value == '') {
      this.setData({ errorMsg: true })
      if (types === '1') {
        this.setData({
          msg: '手机号码不能为空'
        })
      } else if (types === '2') {
        this.setData({
          msg: '验证码不能为空'
        })
      } else if (types === '3') {
        this.setData({
          msg: '密码不能为空'
        })
      } else if (types === '4') {
        this.setData({
          msg: '确认密码不能为空'
        })
      }
    } else {
      this.setData({
        errorMsg: false,
        msg: ''
      })
    }
  },
  //  提交注册
  formSubmit() {
    if (this.data.regApi.mobile != '' && this.data.regApi.smsCode != '' && this.data.regApi.passwordOne != '' && this.data.regApi.passwordTwo != '') {
      if (this.data.regApi.passwordOne != this.data.regApi.passwordTwo) {
        wx.showToast({
          title: '两次密码输入不一致',
          icon: 'none'
        })
      } else {
        app.api.regUser(this.data.regApi).then(res => {
          if (res.code === 1000) {
            app.api.login({
              mobile: this.data.regApi.mobile,
              password: this.data.regApi.passwordOne
            }).then(res => {
              if (res.code === 1000) {
                // 同步方式存储表单数据
                wx.setStorageSync('authorization', res.data.authorization);
                wx.setStorageSync('loginId', res.data.loginId);
                wx.setStorageSync('user', res.data.user)
                wx.showModal({
                  title: '注册成功！',
                  content: '是否前往申请认证商家账户?',
                  success: function (res) {
                    if (res.confirm) {
                      app.utils.getUserInfo(app);
                      wx.redirectTo({
                        url: './parts/authentication/index',
                      })
                    } else if(res.cancel) {
                      app.utils.getUserInfo(app);
                      wx.reLaunch({
                        url: '/pages/index/index',
                      })
                    }
                  }
                })
              }
            })
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      }
    } else {
      wx.showToast({
        title: '表单内容不能为空',
        icon: 'none'
      })
    }
  },
  //  获取验证码
  getCode() {
    let that = this;
    let telReg = /^1[0-9]{10}$/;
    let tel = that.data.regApi.mobile;
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
      //   验证是否注册过？
      // app.api.miniSmsCode({ mobile: that.data.regApi.mobile }).then(res => {
      //   if (res.code === 1000) {
      //     if (!this.data.disable) {
      //       this.setData({
      //         disable: true
      //       })
      //       this.sendSmsCode();
      //     }
      //   } else {
      //     that.setData({
      //       errorMsg: true,
      //       msg: res.message
      //     })
      //   }
      // })
    }
  },
  //  发送验证码
  sendSmsCode() {
    let that = this;
    let params = { mobile: that.data.regApi.mobile };
    app.api.miniSmsCode(params).then(res => {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onUnload: function () {
    wx.removeStorageSync('session_id')
  }
})